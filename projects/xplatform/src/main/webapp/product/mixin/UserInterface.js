/*
 * TODO 이 Mixin은 CMN 모듈로 이동한다.
 */
Ext.define('mixin.UserInterface', function() {
	function createView(view, config) {
		var comp = null;
		if (typeof(view) === 'string') {
			var errMsg = '';
			var callConfig = {
				url : 'pageresource/currentUserCanView',
				params : { // view == pageresource's code,
							// 'SYS.view.user.UserManage'
					pageCode : 'page|' + view // 这里加page，是因为Resource表要求code必须唯一，好判断权限。
				}
			}

			var canView = SF.cf.callServiceSync(callConfig);

			if (canView.result.data == false) {
				SF.alertWarn('警告', '您没有权限浏览此页面!');
				return false;
			}
			comp = Ext.create(view, config);
			return comp;
		} else {
			return view;
		}
	}
	/* Navigation 영역에 탭을 추가하기 */
	function addNav(config) {
		var defaults = {
			tabConfig : {
				width : 29,
				height : 22,
				padding : '0 0 0 2px'
			}
		};

		try {
			var nav = Ext.getCmp('nav').add(Ext.merge(defaults, config));
			if (SF.search) {
				SF.search.register({
					kind : 'nav',
					key : nav.itemId,
					name : nav.title,
					handler : function(item) {
						Ext.getCmp('nav').setActiveTab(nav);
					}
				});
			}
		} catch (e) {
			SF.error('SYS-E003', {}, e);
		}
	}

	/* MainMenu 영역의 Side에 탭을 추가하기 */
	function addSideMenu(view, config) {
		try {
			var sidemenu = Ext.getCmp('sidemenu');
			var menu = Ext.create(view, config);
			sidemenu.insert(0, menu);
		} catch (e) {
			SF.error('SYS-E004', {
				view : view
			}, e);
		}
	}

	function loadController(controller) {//controller is string
		if (controller) {
			Ext.syncRequire(controller); // load needed js file
			// controller and view
			if (Ext.ClassManager.get(controller)) {
				var ctrl = SF.controller.ApplicationController.unique.getController(controller);
				ctrl.init();
				//ctrl.onLaunch(); //这还还不确定到底调用还是不调用
			}
			// SF.controller.ApplicationController.unique.getController(controller);
			// //this is for extjs4.2 ,a big bug for mesplus, for
			// getController() has called doInit()
		}
	}
	
	function loadViewController(viewName){
		var controller = viewName.replace('.view.', '.controller.');
		loadController(controller);
	}
	
	function loadMenuController(menu){
		if (!Ext.ClassManager.get(menu.viewModel) && menu.viewModel.indexOf('.') > 1) {
			loadViewController(menu.viewModel);
		}
	}

	function doMenu(menu, history) {
		if (!menu.viewModel) {
			SF.error('SYS-E002');
			return;
		}

		try {
			var content_area = Ext.getCmp('content');
			loadMenuController(menu);

			menu.itemId = menu.itemId || menu.viewModel;

			var screen;
			if (SF.isFitLayout()) { // zhang
				var config = {
					itemId : menu.itemId,
					closable : false
				};
				if (menu.icon) {
					Ext.apply(config, {
						icon : menu.icon
					});
				}
				var newView = createView(menu.viewModel, config);
				if (newView === false) {
					return false;
				}
				content_area.removeAll();
				screen = content_area.add(newView);
			} else {
				screen = content_area.getComponent(menu.itemId);
				if (!screen) {
					var closable = true;
					if (SF.isCardLayout()) {
						closable = false;
					}
					var config = {
						itemId : menu.itemId,
						closable : closable
					};
					if (menu.icon) {
						Ext.apply(config, {
							icon : menu.icon
						});
					}

					var newView = createView(menu.viewModel, config);
					if (newView === false) {
						return false;
					}
					if (SF.isCardLayout()) {// zhang changed
						screen = content_area.insert(0, newView);
					} else {
						screen = content_area.add(newView);
					}
				}
			}

			/*
			 * CONFIRM parameter 정보가 없더라도 (menu.keys === undefined) setKeys로
			 * keychange 이벤트를 발생시키도록 변경함.
			 */
			if (screen.setKeys) {
				var keys = menu.keys || {}; // zhang added
				screen.setKeys(Ext.apply(keys, {
					icon : menu.icon
				})); // zhang added
				// original is screen.setKeys(menu.keys);
			} else {
				SF.history.add(screen);
			}

			try {
				SF.history.lock();
				if (SF.isTabLayout()) { // tab panel zhang
					content_area.setActiveTab(screen);
				} else if (SF.isCardLayout()) { // card layout for panel zhang
					content_area.getLayout().setActiveItem(screen);
				}
			} finally {
				SF.history.unlock();
			}

			return screen;
		} catch (e) {
			console.log(e)
			SF.error('SYS-E001', {
				view : menu.viewModel
			}, e);
		}
	}

	function popup(viewModel, keys) {
		if (!viewModel) {
			SF.error('SYS-E002');
			return;
		}

		try {
			loadViewController(viewModel);
			var screen = Ext.create(viewModel);
			screen.show();

			/*
			 * CONFIRM parameter 정보가 없더라도 (menu.keys === undefined) setKeys로
			 * keychange 이벤트를 발생시키도록 변경함.
			 */
			if (screen.setKeys) {
				screen.setKeys(keys);
			}

			return screen;
		} catch (e) {
			SF.error('SYS-E001', {
				view : viewModel
			}, e);
		}
	}

	return {
		doMenu : doMenu,
		// addContentView : addContentView,
		addNav : addNav,
		addSideMenu : addSideMenu,
		popup : popup
	};
}());
