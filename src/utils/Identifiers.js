export const userType = {
    superadmin: 'Super Admin',
    schooladmin: 'School Admin',
    hod: 'Department Administrator',
    instructor: 'Instructor',
    student: 'Student',
    subAdmin: 'Sub-Admins',
    serviceAdmin: 'Service Administrator',
}


export const roleTask = {
    school_dept_setup: 1,
    hod_management: 2,
    instructor_management: 3,
    student_management: 4,
    session_semester_setup: 5,
    report_mgt: 6,
}

export const roleTaskList = [
    {
        id: 1,
        name: "School & Department Setup"
    },
    {
        id: 2,
        name: "HOD/Department Admin Management"
    },
    {
        id: 3,
        name: "Instructor Setup/Management"
    },
    {
        id: 4,
        name: "Student Management"
    },
    {
        id: 5,
        name: "Session/Semester Setup"
    },
    {
        id: 6,
        name: "Report Administrator"
    }
]

export const PaymentCheck = {
    EnabledAndPaid: 1,
    EnabledAndNotPaid :2,
    Disabled: 2
    
}
export const FORGOT_PASSWORD = 'forgot_password'
