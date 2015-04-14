/**
 * @jsx React.DOM
 */
var React = require('react'),
    ReactRouter = require('react-router'),
    App = require('./pages/app.js'),
    NotFound = require('./pages/not_found.js'),
    Home = require('./pages/home.js'),
    ResetPassword = require('./pages/reset_password.js'),
    Login = require('./pages/login.js'),
    Class = require('./pages/class.js'),
    Register = require('./pages/register.js'),
    ReviewForm = require('./components/review_form.js'),
    Sheets = require('./pages/degree_sheet.js'),
    SheetManager = require('./pages/sheet_manager.js'),
    CategoryExplorer = require('./pages/category_explorer.js');

module.exports = (
    <ReactRouter.Route handler={App}>
        <ReactRouter.Route name="Home" path="/" handler={Home} />
        <ReactRouter.Route name="Login" path="/login" handler={Login} />
        <ReactRouter.Route name="Sheet" path="/sheet/:sheet_id" handler={Sheets} />
	<ReactRouter.Route name="Register" path="/register" handler={Register} />
        <ReactRouter.Route name="Reset Password" path="/reset/:user/:resetToken" handler={ResetPassword} />
        <ReactRouter.Route name="Sheets" path="/sheet" handler={SheetManager} />
        <ReactRouter.Route name="Class" path="/class/:classId" handler={Class} />
        <ReactRouter.Route name="Category Explorer" path="/category/:categoryId" handler={CategoryExplorer} />
	<ReactRouter.Route name="404" path="/404" handler={NotFound} />
        <ReactRouter.NotFoundRoute handler={NotFound} />

    </ReactRouter.Route>
);
