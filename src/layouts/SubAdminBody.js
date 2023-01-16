import React, { Suspense } from "react";
import Header from "./SubAdminHeader";
import { Route, Switch } from "react-router-dom";
import ErrorBoundary from "../components/ErrorBoundary/ErrorBoundary";
import { connect } from "react-redux";
import {
  mapDispatchToProps,
  mapStateToProps,
  stateKeys,
} from "../redux/actions";

import SubAdminDashboard from "../pages/SubAdmin/Dashboard";
import SchoolAdminFaculties from "../pages/SubAdmin/Faculties";
import SchoolAdminSession from "../pages/SubAdmin/SessionSemester";
import SchoolAdminHods from "../pages/SubAdmin/Hods";
import SchoolAdminStudents from "../pages/SubAdmin/Students";
import SchoolAdminInstructors from "../pages/SubAdmin/Instructors";
import SchoolAdminDepartments from "../pages/SubAdmin/Departments";
import SchoolAdminDepartmentInstructors from "../pages/SubAdmin/DepartmentInstructors";
import SchoolAdminDepartmentHods from "../pages/SubAdmin/DepartmentHods";
import SchoolAdminDepartmentStudents from "../pages/SubAdmin/DepartmentStudents";
import SchoolAdminProfile from "../pages/SubAdmin/Profile";
import SchoolAdminReportInstructor from "../pages/SubAdmin/ReportInstructor";
import SchoolAdminReportStudent from "../pages/SubAdmin/ReportStudent";
import SchoolAdminAssignmentReport from "../pages/SubAdmin/ReportAssignmentCummulativeScore";
import SchoolAdminAllAssignment from "../pages/SubAdmin/ReportAllAssignment";
import Audits from "../pages/SubAdmin/Audits";
import QuizReport from "../pages/SchoolAdmin/QuizAssignmentReport";
// import SubAdmins from "../pages/SubAdmin/Subadmins";

const SubAdminBody = (props) => {
  return (
    <>
      <div className={props[stateKeys.PAGE_CLASS]}>
        <section className="sidenav-enabled pb-3 pb-md-4" style={{minHeight:"90vh"}}>
          <Header />
          <ErrorBoundary>
            <Suspense fallback={<p>Loading...</p>}>
              <div className="main-content pt-md-5">
                <Switch>
                  <Route
                    path={"/subadmin/dashboard"}
                    component={SubAdminDashboard}
                    exact={true}
                  />
                  <Route
                    path={"/subadmin/faculties"}
                    component={SchoolAdminFaculties}
                    exact={true}
                  />
                   <Route
                    path={"/subadmin/audits"}
                    component={Audits}
                    exact={true}
                  />
                  <Route
                    path={"/subadmin/sessionsemester"}
                    component={SchoolAdminSession}
                    exact={true}
                  />
                  <Route
                    path={"/subadmin/hods"}
                    component={SchoolAdminHods}
                    exact={true}
                  />
                  <Route
                    path={"/subadmin/students"}
                    component={SchoolAdminStudents}
                    exact={true}
                  />
                  <Route
                    path={"/subadmin/instructors"}
                    component={SchoolAdminInstructors}
                    exact={true}
                  />
                  <Route
                    path={"/subadmin/departments"}
                    component={SchoolAdminDepartments}
                    exact={true}
                  />
                  <Route
                    path={"/subadmin/departmentinstructors"}
                    component={SchoolAdminDepartmentInstructors}
                    exact={true}
                  />
                  <Route
                    path={"/subadmin/departmenthods"}
                    component={SchoolAdminDepartmentHods}
                    exact={true}
                  />
                  <Route
                    path={"/subadmin/profile"}
                    component={SchoolAdminProfile}
                    exact={true}
                  />
                  <Route
                    path={"/subadmin/departmentstudents"}
                    component={SchoolAdminDepartmentStudents}
                    exact={true}
                  />
                  <Route
                    path={"/subadmin/instructorreport"}
                    component={SchoolAdminReportInstructor}
                    exact={true}
                  />
                  <Route
                    path={"/subadmin/studentreport"}
                    component={SchoolAdminReportStudent}
                    exact={true}
                  />
                  <Route
                    path={"/subadmin/allassignment"}
                    component={SchoolAdminAssignmentReport}
                    exact={true}
                  />
                  <Route
                    path={"/subadmin/assignmentreport"}
                    component={SchoolAdminAllAssignment}
                    exact={true}
                  />

                  <Route
                    path={"/subadmin/quizreport"}
                    component={SchoolAdminAllAssignment}
                    exact={true}
                  />
                </Switch>
              </div>
            </Suspense>
          </ErrorBoundary>
        </section>
        <p className="text-center copyright" style={{fontSize:"14px"}}>Powered by <span className="text-success">TETfund</span></p>
      </div>
    </>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(SubAdminBody);
