import React, {Suspense} from 'react';
import Header from "./ServiceAdminHeader";
import {Route, Switch} from "react-router-dom";
import ErrorBoundary from "../components/ErrorBoundary/ErrorBoundary";
import {connect} from "react-redux";
import {mapDispatchToProps, mapStateToProps, stateKeys} from "../redux/actions";

import HODDashboard from "../pages/ServiceAdmin/Dashboard";
import HODInstructors from "../pages/ServiceAdmin/Instructors";
import ManageInstructors from "../pages/ServiceAdmin/manage_instructors";
import HODCourses from "../pages/ServiceAdmin/Courses";
import HODAnnouncements from "../pages/ServiceAdmin/Announcements";
import HODProfile from "../pages/ServiceAdmin/Profile";
import EmailNotification from "../pages/ServiceAdmin/EmailNotification";

const HODBody = (props) => {
	return (
		<>
			<div className={props[stateKeys.PAGE_CLASS]}>
				<section className="sidenav-enabled pb-3 pb-md-4" style={{minHeight:"90vh"}}>
					<Header/>
					<ErrorBoundary>
						<Suspense fallback={<p>Loading...</p>}>
							<div className="main-content pt-md-5">
								<Switch>
									<Route path={'/serviceadmin/dashboard'} component={HODDashboard} exact={true}/>
									<Route path={'/serviceadmin/instructors'} component={HODInstructors} exact={true}/>
									<Route path={'/serviceadmin/courses'} component={HODCourses} exact={true}/>
									<Route path={'/serviceadmin/announcements'} component={HODAnnouncements} exact={true}/>
									<Route path={'/serviceadmin/profile'} component={HODProfile} exact={true}/>
									<Route path={'/serviceadmin/manage_instructor'} component={ManageInstructors} exact={true}/>
									<Route path={'/serviceadmin/emailnotification'} component={EmailNotification} exact={true}/>
								</Switch>
							</div>
						</Suspense>
					</ErrorBoundary>
				</section>
				<p className="text-center copyright" style={{fontSize:"14px"}}>Powered by <span className="text-success">TETfund</span></p>
			</div>
		</>
	)
};

export default connect(mapStateToProps, mapDispatchToProps)(HODBody);