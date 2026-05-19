/* eslint-disable @next/next/no-img-element */
/* Auto-generated from static HTML — preserve class names for theme/CSS */
export default function Sidebar() {
  return (
    <>
      <aside className="sidebar">
        <button type="button" className="sidebar-close-btn">
          <iconify-icon icon="radix-icons:cross-2"></iconify-icon>
        </button>
        <div className="">
          <div className="sidebar-logo d-flex align-items-center justify-content-between">
            <a href="/" className="">
              <img src="/assets/images/logo.png" alt="site logo" className="light-logo" />
              <img src="/assets/images/logo-light.png" alt="site logo" className="dark-logo" />
              <img src="/assets/images/logo-icon.png" alt="site logo" className="logo-icon" />
            </a>
            <button type="button" className="text-xxl d-xl-flex d-none line-height-1 sidebar-toggle text-neutral-500"
              aria-label="Collapse Sidebar">
              <i className="ri-contract-left-line"></i>
            </button>
          </div>
        </div>
        
        <div className="mx-16 py-12">
          <div className="dropdown profile-dropdown">
            <button type="button"
              className="profile-dropdown__button d-flex align-items-center justify-content-between p-10 w-100 overflow-hidden bg-neutral-50 radius-12 "
              data-bs-toggle="dropdown" data-bs-display="static" aria-expanded="false">
              <span className="d-flex align-items-start gap-10">
                <img src="/assets/images/thumbs/leave-request-img2.png" alt="Thumbnail"
                  className="w-40-px h-40-px rounded-circle object-fit-cover flex-shrink-0" />
                <span className="profile-dropdown__contents">
                  <span className="h6 mb-0 text-md d-block text-primary-light">Jone Copper</span>
                  <span className="text-secondary-light text-sm mb-0 d-block">Admin</span>
                </span>
              </span>
              <span className="profile-dropdown__icon pe-8 text-xl d-flex line-height-1">
                <i className="ri-arrow-right-s-line"></i>
              </span>
            </button>
            <ul className="dropdown-menu dropdown-menu-lg-end border p-12">
              <li>
                <a href="/student-details" 
                  className="dropdown-item rounded text-secondary-light bg-hover-neutral-200 text-hover-neutral-900 d-flex align-items-center gap-2 py-6">
                  <i className="ri-user-3-line"></i>
                  My Profile
                </a>
              </li>
              <li>
                <a href="/general"
                  className="dropdown-item rounded text-secondary-light bg-hover-neutral-200 text-hover-neutral-900 d-flex align-items-center gap-2 py-6">
                  <i className="ri-settings-3-line"></i>
                  Setting
                </a>
              </li>
              <li>
                <a href="/login"
                  className="dropdown-item rounded text-secondary-light bg-hover-neutral-200 text-hover-neutral-900 d-flex align-items-center gap-2 py-6">
                  <i className="ri-shut-down-line"></i>
                  Log Out
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="sidebar-menu-area">
          <ul className="sidebar-menu" id="sidebar-menu">
            <li className="dropdown">
              <a href="javascript:void(0)">
                <i className="ri-home-4-line"></i>
                <span>Dashboard </span>
              </a>
              <ul className="sidebar-submenu">
                <li>
                  <a href="/">
                    <i className="ri-circle-fill circle-icon w-auto"></i>
                    School
                  </a>
                </li>
                <li>
                  <a href="/index-2">
                    <i className="ri-circle-fill circle-icon w-auto"></i>
                    Student
                  </a>
                </li>
                <li>
                  <a href="/index-3">
                    <i className="ri-circle-fill circle-icon w-auto"></i>
                    Teacher
                  </a>
                </li>
                <li>
                  <a href="/index-4">
                    <i className="ri-circle-fill circle-icon w-auto"></i>
                    Parent
                  </a>
                </li>
                <li>
                  <a href="/index-5">
                    <i className="ri-circle-fill circle-icon w-auto"></i>
                    LMS 
                  </a>
                </li>
                <li>
                  <a href="/index-6">
                    <i className="ri-circle-fill circle-icon w-auto"></i>
                    University 
                  </a>
                </li>
              </ul>
            </li>
            <li className="dropdown">
              <a href="javascript:void(0)">
                <i className="ri-graduation-cap-line"></i>
                <span>Students</span>
              </a>
              <ul className="sidebar-submenu">
                <li>
                  <a href="/add-new-student">
                    <i className="ri-circle-fill circle-icon w-auto"></i>
                    Add New Student
                  </a>
                </li>
                <li>
                  <a href="/student-list">
                    <i className="ri-circle-fill circle-icon w-auto"></i>
                    Student List
                  </a>
                </li>
                <li>
                  <a href="/suspended-student">
                    <i className="ri-circle-fill circle-icon w-auto"></i>
                    Suspend Student
                  </a>
                </li>
                <li>
                  <a href="/student-category">
                    <i className="ri-circle-fill circle-icon w-auto"></i>
                    Student Categories
                  </a>
                </li>
                <li>
                  <a href="/edit-student">
                    <i className="ri-circle-fill circle-icon w-auto"></i>
                    Edit Student
                  </a>
                </li>
                <li>
                  <a href="/student-details">
                    <i className="ri-circle-fill circle-icon w-auto"></i>
                    Student Details
                  </a>
                </li>
              </ul>
            </li>
            <li className="dropdown">
              <a href="javascript:void(0)">
                <i className="ri-user-follow-line"></i>
                <span>Teachers</span>
              </a>
              <ul className="sidebar-submenu">
                <li>
                  <a href="/add-new-teacher">
                    <i className="ri-circle-fill circle-icon w-auto"></i>
                    Add New Teacher
                  </a>
                </li>
                <li>
                  <a href="/teacher-list">
                    <i className="ri-circle-fill circle-icon w-auto"></i>
                    Teacher List
                  </a>
                </li>
                <li>
                  <a href="/edit-teacher">
                    <i className="ri-circle-fill circle-icon w-auto"></i>
                    Edit Teacher
                  </a>
                </li>
                <li>
                  <a href="/teacher-details">
                    <i className="ri-circle-fill circle-icon w-auto"></i>
                    Teacher Details
                  </a>
                </li>
                <li>
                  <a href="/teacher-timetable">
                    <i className="ri-circle-fill circle-icon w-auto"></i>
                    Teacher Timetable
                  </a>
                </li>
              </ul>
            </li>
            <li className="dropdown">
              <a href="javascript:void(0)">
                <i className="ri-account-circle-line"></i>
                <span>Guardian</span>
              </a>
              <ul className="sidebar-submenu">
                <li>
                  <a href="/add-new-guardian">
                    <i className="ri-circle-fill circle-icon w-auto"></i>
                    Add New Guardians
                  </a>
                </li>
                <li>
                  <a href="/guardian-list">
                    <i className="ri-circle-fill circle-icon w-auto"></i>
                    Guardians List
                  </a>
                </li>
                <li>
                  <a href="/edit-guardian">
                    <i className="ri-circle-fill circle-icon w-auto"></i>
                    Edit Guardian
                  </a>
                </li>
                <li>
                  <a href="/guardian-details">
                    <i className="ri-circle-fill circle-icon w-auto"></i>
                    Guardian Details
                  </a>
                </li>
              </ul>
            </li>
            <li className="dropdown">
              <a href="javascript:void(0)">
                <i className="ri-list-view"></i>
                <span>Classes</span>
              </a>
              <ul className="sidebar-submenu">
                <li>
                  <a href="/section-list">
                    <i className="ri-circle-fill circle-icon w-auto"></i>
                    Section
                  </a>
                </li>
                <li>
                  <a href="/subject-list">
                    <i className="ri-circle-fill circle-icon w-auto"></i>
                    Subjects
                  </a>
                </li>
                <li>
                  <a href="/class-list">
                    <i className="ri-circle-fill circle-icon w-auto"></i>
                    Class List
                  </a>
                </li>
                <li>
                  <a href="/class-room-list">
                    <i className="ri-circle-fill circle-icon w-auto"></i>
                    Class Room
                  </a>
                </li>
              </ul>
            </li>
            <li className="dropdown">
              <a href="javascript:void(0)">
                <i className="ri-file-edit-line"></i>
                <span>Examinations</span>
              </a>
              <ul className="sidebar-submenu">
                <li>
                  <a href="/exam">
                    <i className="ri-circle-fill circle-icon w-auto"></i>
                    Exam
                  </a>
                </li>
                <li>
                  <a href="/exam-schedule">
                    <i className="ri-circle-fill circle-icon w-auto"></i>
                    Exam Schedule
                  </a>
                </li>
                <li>
                  <a href="/exam-result">
                    <i className="ri-circle-fill circle-icon w-auto"></i>
                    Exam Result
                  </a>
                </li>
              </ul>
            </li>
            <li className="dropdown">
              <a href="javascript:void(0)">
                <i className="ri-money-dollar-circle-line"></i>
                <span>Fees Collection</span>
              </a>
              <ul className="sidebar-submenu">
                <li>
                  <a href="/fees-collect">
                    <i className="ri-circle-fill circle-icon w-auto"></i>
                    Fees Collect
                  </a>
                </li>
                <li>
                  <a href="/fees-type">
                    <i className="ri-circle-fill circle-icon w-auto"></i>
                    Fees Type
                  </a>
                </li>
                <li>
                  <a href="/fees-group">
                    <i className="ri-circle-fill circle-icon w-auto"></i>
                    Fees Group
                  </a>
                </li>
                <li>
                  <a href="/fees-discount">
                    <i className="ri-circle-fill circle-icon w-auto"></i>
                    Fees Discount
                  </a>
                </li>
              </ul>
            </li>
            <li className="dropdown">
              <a href="javascript:void(0)">
                <i className="ri-calendar-check-line"></i>
                <span>Attendance</span>
              </a>
              <ul className="sidebar-submenu">
                <li>
                  <a href="/student-attendance">
                    <i className="ri-circle-fill circle-icon w-auto"></i>
                    Student Attendance
                  </a>
                </li>
                <li>
                  <a href="/teacher-attendance">
                    <i className="ri-circle-fill circle-icon w-auto"></i>
                    Teacher Attendance
                  </a>
                </li>
                <li>
                  <a href="/employee-attendance">
                    <i className="ri-circle-fill circle-icon w-auto"></i>
                    Employee Attendance
                  </a>
                </li>
              </ul>
            </li>
            <li className="dropdown">
              <a href="javascript:void(0)">
                <i className="ri-time-line"></i>
                <span>Leaves</span>
              </a>
              <ul className="sidebar-submenu">
                <li>
                  <a href="/leave-types">
                    <i className="ri-circle-fill circle-icon w-auto"></i>
                    Leave Types
                  </a>
                </li>
                <li>
                  <a href="/leave-request">
                    <i className="ri-circle-fill circle-icon w-auto"></i>
                    Leave Request
                  </a>
                </li>
              </ul>
            </li>
            <li>
              <a href="/certificate">
                <i className="ri-home-4-line"></i>
                <span>Certificate </span>
              </a>
            </li>
            <li className="dropdown">
              <a href="javascript:void(0)">
                <i className="ri-book-2-line"></i>
                <span>Library</span>
              </a>
              <ul className="sidebar-submenu">
                <li>
                  <a href="/books-list">
                    <i className="ri-circle-fill circle-icon w-auto"></i>
                    Books List
                  </a>
                </li>
                <li>
                  <a href="/members-list">
                    <i className="ri-circle-fill circle-icon w-auto"></i>
                    Members List
                  </a>
                </li>
                <li>
                  <a href="/member-details">
                    <i className="ri-circle-fill circle-icon w-auto"></i>
                    Members Details
                  </a>
                </li>
                <li>
                  <a href="/issue-return">
                    <i className="ri-circle-fill circle-icon w-auto"></i>
                    Issue Return
                  </a>
                </li>
              </ul>
            </li>
            <li className="dropdown">
              <a href="javascript:void(0)">
                <i className="ri-money-dollar-circle-line"></i>
                <span>Accounts</span>
              </a>
              <ul className="sidebar-submenu">
                <li>
                  <a href="/income-head">
                    <i className="ri-circle-fill circle-icon w-auto"></i>
                    Income Head
                  </a>
                </li>
                <li>
                  <a href="/income-list">
                    <i className="ri-circle-fill circle-icon w-auto"></i>
                    Income List
                  </a>
                </li>
                <li>
                  <a href="/expense-head">
                    <i className="ri-circle-fill circle-icon w-auto"></i>
                    Expense Head
                  </a>
                </li>
                <li>
                  <a href="/expense-list">
                    <i className="ri-circle-fill circle-icon w-auto"></i>
                    Expense List
                  </a>
                </li>
                <li>
                  <a href="/transaction">
                    <i className="ri-circle-fill circle-icon w-auto"></i>
                    Transaction
                  </a>
                </li>
              </ul>
            </li>
            <li className="dropdown">
              <a href="javascript:void(0)">
                <i className="ri-user-settings-line"></i>
                <span>HRM</span>
              </a>
              <ul className="sidebar-submenu">
                <li>
                  <a href="/employee-list">
                    <i className="ri-circle-fill circle-icon w-auto"></i>
                    Employee List
                  </a>
                </li>
                <li>
                  <a href="/employee-details">
                    <i className="ri-circle-fill circle-icon w-auto"></i>
                    Employee Details
                  </a>
                </li>
                <li>
                  <a href="/add-new-employee">
                    <i className="ri-circle-fill circle-icon w-auto"></i>
                    Add New Employee
                  </a>
                </li>
                <li>
                  <a href="/payroll">
                    <i className="ri-circle-fill circle-icon w-auto"></i>
                    Payroll
                  </a>
                </li>
                <li>
                  <a href="/designation">
                    <i className="ri-circle-fill circle-icon w-auto"></i>
                    Designation
                  </a>
                </li>
                <li>
                  <a href="/department">
                    <i className="ri-circle-fill circle-icon w-auto"></i>
                    Department
                  </a>
                </li>
              </ul>
            </li>
            <li>
              <a href="/notice-board">
                <i className="ri-booklet-line"></i>
                <span>Notice Board </span>
              </a>
            </li>
            <li>
              <a href="/event">
                <i className="ri-calendar-event-line"></i>
                <span>Event </span>
              </a>
            </li>
            <li>
              <a href="/message">
                <i className="ri-message-2-line"></i>
                <span>Message </span>
              </a>
            </li>
            <li>
              <a href="/subscription-plan">
                <i className="ri-price-tag-3-line"></i>
                <span>Subscription Plan </span>
              </a>
            </li>
            <li>
              <a href="/role-access">
                <i className="ri-macbook-line"></i>
                <span>Role & Access</span>
              </a>
            </li>
               <li className="dropdown">
              <a href="javascript:void(0)">
                <i className="ri-shield-check-line"></i>
                <span>Authentication</span>
              </a>
              <ul className="sidebar-submenu">
                <li>
                  <a href="/login"><i className="ri-circle-fill circle-icon text-primary-600 w-auto"></i> Login</a>
                </li>
                <li>
                  <a href="/register"><i className="ri-circle-fill circle-icon text-warning-main w-auto"></i> Register</a>
                </li>
              </ul>
            </li>
            <li>
              <a href="/assign-role-plan">
                <i className="ri-user-follow-line"></i>
                <span>Assign Role</span>
              </a>
            </li>
            <li className="dropdown">
              <a href="javascript:void(0)">
                <i className="ri-user-settings-line"></i>
                <span>Settings</span>
              </a>
              <ul className="sidebar-submenu">
                <li>
                  <a href="/general">
                    <i className="ri-circle-fill circle-icon w-auto"></i>
                    General
                  </a>
                </li>
                <li>
                  <a href="/notification">
                    <i className="ri-circle-fill circle-icon w-auto"></i>
                    Notification
                  </a>
                </li>
                <li>
                  <a href="/currencies">
                    <i className="ri-circle-fill circle-icon w-auto"></i>
                    Currencies
                  </a>
                </li>
                <li>
                  <a href="/languages">
                    <i className="ri-circle-fill circle-icon w-auto"></i>
                    Languages
                  </a>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </aside>
    </>
  );
}
