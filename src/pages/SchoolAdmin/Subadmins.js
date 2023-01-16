import React, { Component } from "react";
import * as Unicons from "@iconscout/react-unicons";
// import { UisCornerDownLeft } from '@iconscout/react-unicons-solid'

import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { Link } from "react-router-dom";
import Endpoint from "../../utils/endpoint";
import { handleFormSubmissionError } from "../../utils/helpers";
import toast, { Toaster } from "react-hot-toast";
import ClipLoader from "react-spinners/ClipLoader";
import Folder from "../../assets/images/empty2.png";
import { MDBDataTableV5 } from "mdbreact";
import { connect } from "react-redux";
import { mapDispatchToProps, mapStateToProps } from "../../redux/actions";
import { format } from "date-fns";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Spinner from "../Front/Spinner"
import { roleTaskList, roleTask } from "../../utils/Identifiers"
const top100Films = [
    { label: "The Godfather", id: 1 },
    { label: "Pulp Fiction", id: 2 },
];
//   const defaultProps = {
//     options: top100Films,
//     getOptionLabel: (option) => option.id,
//   };
class SubAdmins extends Component {
    state = {
        pageLoading: false,
        thisFaculty: [],
        subadminlist:[],
        // defaultProps : {
        // 	options: top100Films,
        // 	getOptionLabel: (option) => option.id,
        //   },
        allHods: [],
        searchResults: [],
        newHod: false,
        newHodFormIncomplete: false,
        newHodFName: "",
        newHodLName: "",
        newHodOName: "",
        newHodEmail: "",
        newHodDepartment: "",
        newHodLoading: false,

        allInstructors: [],
        assignHod: false,
        assignHodLoading: false,
        assignHodFormIncomplete: false,
        assignHodInstructor: "",
        assignHodDepartment: "",
        deleteHodModal: false,
        departmentId: 0,
        InstitutionStaff: []
    };

    toggleNewHod = () => {
        this.setState({ newHod: !this.state.newHod });
    };
    closeNewHod = () => {
        this.setState({ newHod: false });
    };
    openNewHod = () => {
        this.setState({ newHod: true });
    };

    toggleAssignHod = () => {
        this.setState({ assignHod: !this.state.assignHod });
    };

    openAssignHod = () => {
        this.setState({ assignHod: true });
    };

    closeAssignHod = () => {
        this.setState({ assignHod: false });
    };

    newHodSuccess = () =>
        toast.success("action successful!", {
            style: {
                border: "1px solid #56b39d",
                padding: "16px",
                background: "#56b39d",
                color: "#fff",
                borderRadius: "2rem",
            },
            iconTheme: {
                primary: "#FFFAEE",
                secondary: "#56b39d",
            },
        });
executeDelegateTask = () => {
    this.setState({assignHodLoading:true})
    Endpoint.delegateAdmin(this.state.selectedUserId, this.state.selectedTaskId)
    .then((res) => {
        if(!res.data.status){
            this.notificatioWarning(res.data.message)
             this.setState({assignHodLoading:false})
            return;
        }
        this.newHodSuccess()
        this.loadDataFromServer()
        this.setState({assignHod:false})
        console.log(res)
    this.setState({assignHodLoading:false})

    })
    .catch((err) => {
        console.log(err)
    this.setState({assignHodLoading:false})

    })
}
    assignHodSuccess = (data) =>
        toast.success(data, {
            style: {
                border: "1px solid #56b39d",
                padding: "16px",
                background: "#56b39d",
                color: "#fff",
                borderRadius: "2rem",
            },
            iconTheme: {
                primary: "#FFFAEE",
                secondary: "#56b39d",
            },
        });
        
    notificatioWarning = (data) =>
        toast.error(data, {
            style: {
                border: "1px solid #FFCC00",
                padding: "16px",
                background: "#FFCC00",
                color: "#000",
                borderRadius: "2rem",
            },
            iconTheme: {
                primary: "#000",
                secondary: "#FFCC00",
            },
        });
    createHodExists = () =>
        toast.error("A HOD has already been assigned to this department", {
            style: {
                border: "1px solid #FFCC00",
                padding: "16px",
                background: "#FFCC00",
                color: "#000",
                borderRadius: "2rem",
            },
            iconTheme: {
                primary: "#000",
                secondary: "#FFCC00",
            },
        });

    editHodSuccess = () =>
        toast.success("HOD edited successfully", {
            style: {
                border: "1px solid #56b39d",
                padding: "16px",
                background: "#56b39d",
                color: "#fff",
                borderRadius: "2rem",
            },
            iconTheme: {
                primary: "#FFFAEE",
                secondary: "#56b39d",
            },
        });

    deleteHODSuccess = () =>
        toast.success("HOD deleted successfully", {
            style: {
                border: "1px solid #56b39d",
                padding: "16px",
                background: "#56b39d",
                color: "#fff",
                borderRadius: "2rem",
            },
            iconTheme: {
                primary: "#FFFAEE",
                secondary: "#56b39d",
            },
        });

    loadDataError = (error) =>
        toast.error("Something went wrong, pls check your connection.", {
            style: {
                border: "1px solid #DC2626",
                padding: "16px",
                background: "#DC2626",
                color: "#fff",
                borderRadius: "3rem",
            },
            iconTheme: {
                primary: "#FFFAEE",
                secondary: "#DC2626",
            },
        });

    createHod = (e) => {
        console.log("responsedata=======");
        e.preventDefault();

        if (!this.state.newHodFName || !this.state.newHodLName || !this.state.newHodOName || !this.state.newHodEmail) {
            this.setState({ newHodFormIncomplete: true });

            setTimeout(() => {
                this.setState({ newHodFormIncomplete: false });
            }, 3000);

            return;
        }

        this.setState({
            newHodLoading: true,
            success: false,
            error: false,
        });

        const hodProps = {
            firstname: this.state.newHodFName,
            surname: this.state.newHodLName,
            othername: this.state.newHodOName,
            email: this.state.newHodEmail,
            //departmentId: parseInt(this.state.newHodDepartment),
            roleId: 6,
        };

        Endpoint.createHod(hodProps)
            .then((res) => {
                console.log(res.data);
                if (res.status === 200) {
                    this.setState({
                        error: false,
                        success: true,
                        newHodLoading: false,
                        newHod: false,

                        newHodFName: "",
                        newHodLName: "",
                        newHodOName: "",
                        newHodEmail: "",
                        newHodDepartment: "",
                    });

                    if (res.data.statusCode === 200) {
                        this.newHodSuccess();
                    } else if (res.data.statusCode === 400) {
                        this.createHodExists();
                    }

                    setTimeout(() => {
                        this.loadDataFromServer();
                    }, 2000);
                } else {
                    this.setState({ error: true, errorMessage: "Something went wrong, try again later", success: false, newHodLoading: false });
                }

                console.log(res.data, "responsedata=======");
            })
            .catch((error) => {
                console.log(error, "responserrorrss=======");
                this.loadDataError(error, this);
                this.setState({ pageLoading: false, newHodLoading: false });
            });
    };

    assignHod = (e) => {
        console.log("responsedata=======");
        e.preventDefault();

        if (!this.state.assignHodDepartment || !this.state.assignHodInstructor) {
            this.setState({ assignHodFormIncomplete: true });

            setTimeout(() => {
                this.setState({ assignHodFormIncomplete: false });
            }, 3000);

            return;
        }

        this.setState({
            assignHodLoading: true,
            success: false,
            error: false,
        });

        const assignHodProps = {
            userId: parseInt(this.state.assignHodInstructor),
            departmentId: parseInt(this.state.assignHodDepartment),
        };

        Endpoint.assignHod(assignHodProps)
            .then((res) => {
                console.log(res.data);
                this.setState({
                    error: false,
                    success: true,
                    assignHodLoading: false,
                    assignHod: false,
                });
                if (res.data.statusCode == 200 || res.data.statusCode == 201) {
                    this.assignHodSuccess(res.data.message);
                } else {
                    this.notificatioWarning(res.data.message);
                }

                setTimeout(() => {
                    this.loadDataFromServer();
                }, 2000);
            })
            .catch((error) => {
                this.loadDataError(error, this);
                this.setState({ pageLoading: false, assignHodLoading: false });
            });
    };

    openEditHod = (department) => {
        this.setState({
            editingDepartment: department,
            editingDepartmentName: department.name,
            editDepartment: true,
        });
    };

    // openDeleteHod = (department) => {
    // 	this.setState({
    // 		// deletingDepartment: department,
    // 		// deletingDepartmentName: department.name,
    // 		deleteDepartment: true,
    // 	})
    // };
    openDeleteHod = (e) => {
        this.setState({
            deleteHodModal: !this.state.deleteHodModal,
            departmentId: e.departmentId,
            departmentName: e.departmentName,
        });
    };

    editHod = (e) => {
        e.preventDefault();

        if (this.state.editingDepartmentName === "" || this.state.editingDepartment.name === this.state.editingDepartmentName) {
            this.setState({ editDepartmentFormIncomplete: true });

            setTimeout(() => {
                this.setState({ editDepartmentFormIncomplete: false });
            }, 2000);

            return;
        }

        this.setState({
            editDepartmentLoading: true,
            success: false,
            error: false,
        });

        const editDepartmentProps = {
            name: this.state.editingDepartmentName,
            id: this.state.editingDepartment.id,
        };

        Endpoint.editDepartment(editDepartmentProps)
            .then((res) => {
                if (res.status === 200) {
                    this.setState({ error: false, success: true, editDepartmentLoading: false, editDepartment: false, editingDepartmentName: "" });

                    this.editDepartmentSuccess();

                    setTimeout(() => {
                        this.loadDataFromServer();
                    }, 2000);
                } else {
                    this.setState({ error: true, errorMessage: "Something went wrong, try again later", success: false, editDepartmentLoading: false });
                }
            })
            .catch((error) => {
                this.loadDataError(error, this);
                this.setState({ editDepartmentLoading: false });
            });
    };

    deleteHod = (e) => {
        e.preventDefault();
        console.log(this.state.departmentId, "departmentId");


        Endpoint.deleteHod(this.state.departmentId).then((res) => {
            this.setState({ error: false, success: true, deleteDepartmentLoading: false, deleteDepartment: false, deletingDepartmentName: "", deleteHodModal: false });

            this.deleteHODSuccess();

            setTimeout(() => {
                this.loadDataFromServer();
            }, 2000);
        });
    };

    loadDataFromServer = () => {
        let user = JSON.parse(localStorage.getItem("user"));
        this.setState({ user: user });

        this.setState({ pageLoading: true });




        Endpoint.getAllSubAdmins()
            .then((res) => {
                let mappedData = res.data.map((x, i) => {
                    return {
                        sNo: i + 1,
                        name: <span searchvalue={x.name} className="capital" >{x.name}</span>,
                        actions:
                            <div>
                                <button
                                    onClick={() => this.toggleManageAdmin(x)}
                                    className="btn btn-sm btn-primary">
                                    <Unicons.UilUsersAlt size="19" /> manage
                                </button>
                            </div>
                    }
                });

                let tableData = {
                    columns: [
                        {
                            label: 'S/No',
                            field: 'sNo',
                        },
                        {
                            label: 'Name',
                            field: 'name',
                        },
                        {
                            label: 'Actions',
                            field: 'actions',
                        },
                    ],
                    rows: mappedData,
                };

                this.setState({ subadminlist: tableData });
                this.setState({ responseList: res.data });
                console.log(res.data, "Officials")
            })
            .catch((error) => {
                this.loadDataError(error, this);
                this.setState({ pageLoading: false });
            });


        this.setState({
            pageLoading: false
        })
    };
    executeSearch = (e) => {
        let s = e.target.value;
        this.setState({ InstitutionStaff: [] })
        console.log(s);

        Endpoint.getAllInstitutionStaff(s)
            .then((res) => {
                this.setState({ InstitutionStaff: res.data, pageLoading: false });
                console.log(res.data, "Officials")
            })
            .catch((error) => {
                this.loadDataError(error, this);
                this.setState({ pageLoading: false });
            });

    };
    resolveAutoCompleteSelect = (e) => {
        this.setState({
            assignHodInstructor: e.userId
        })
        setTimeout(() => {
            console.log(this.state.assignHodInstructor);
        }, 1500);
    };

    toggleManageAdmin = (data) => {
        this.setState({
            showManageAdmin: !this.state.showManageAdmin,
            delegations: data.delegationsDtos
        })
        console.log(data.delegationsDtos)
    }
    revokeAdminPrivilege = (data) => {
        this.setState({btnLoading:true})
        Endpoint.revokeTask(parseInt(data))
        .then((res) => {
            this.assignHodSuccess("Revoked!")
            this.loadDataFromServer();
            this.setState({btnLoading:false, showManageAdmin:false})
            console.log(res)

        })
        .catch((err) => {
            console.log(err)
        })
    }
    componentDidMount() {


        this.loadDataFromServer();

    }

    render() {
        return (
            <>
                {this.state.pageLoading ?
                    <Spinner
                        message={"Just a moment"}
                    />
                    : null
                }

                <Toaster position="top-center" reverseOrder={false} />

                <div className="container-fluid py-5">
                    <div className="d-flex flex-wrap justify-content-between">
                        <h1 className="mb-3 mr-2 text-primary my-auto">
                            <Unicons.UilBookAlt size="26" className="mr-2" />
                            Sub-Administrator Management
                        </h1>

                        <div>
                            <button className="btn btn-outline-primary" onClick={this.openAssignHod}>
                                <Unicons.UilUserCheck size="20" /> Delegate Admin
                            </button>

                            <button className="btn btn-primary" onClick={this.openNewHod}>
                                <Unicons.UilPlus size="20" /> New Sub-admin
                            </button>
                        </div>
                    </div>

                    <hr />

                    <div className="overflow-scroll">
                        <MDBDataTableV5 hover striped entriesOptions={[10, 20, 25]} entries={10} pagesAmount={4} pagingTop searchTop searchBottom={false} data={this.state.subadminlist} sortRows={["hodName"]} />
                    </div>
                </div>

                <Modal isOpen={this.state.newHod} toggle={this.toggleNewHod} className="mt-5 md" size="lg">
                    <form onSubmit={(e) => this.createHod(e)}>
                        <ModalHeader toggle={this.toggleNewHod}>
                            <span className="h2">Add New Sub-Admin</span>
                        </ModalHeader>

                        <ModalBody>
                            <div className="form-group row">
                                <div className="col-md-6 ">
                                    <label className="mt-3 mr-2 ">
                                        <b>First Name:</b>
                                    </label>

                                    <div className="">
                                        <input
                                            id="clearName"
                                            type="text"
                                            className="form-control"
                                            value={this.state.newHodFName}
                                            onChange={(e) =>
                                                this.setState({
                                                    newHodFName: e.target.value,
                                                })
                                            }
                                        />
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <label className="mt-3 mr-2 ">
                                        <b>Last Name:</b>
                                    </label>

                                    <div className="">
                                        <input
                                            id="clearName"
                                            type="text"
                                            className="form-control"
                                            value={this.state.newHodLName}
                                            onChange={(e) =>
                                                this.setState({
                                                    newHodLName: e.target.value,
                                                })
                                            }
                                        />
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <label className="mt-3 mr-2 ">
                                        <b>Other Name:</b>
                                    </label>

                                    <div className="">
                                        <input
                                            id="clearName"
                                            type="text"
                                            className="form-control"
                                            value={this.state.newHodOName}
                                            onChange={(e) =>
                                                this.setState({
                                                    newHodOName: e.target.value,
                                                })
                                            }
                                        />
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <label className="mt-3 mr-2 ">
                                        <b>Email:</b>
                                    </label>

                                    <div className="">
                                        <input
                                            id="clearName"
                                            type="text"
                                            className="form-control"
                                            value={this.state.newHodEmail}
                                            onChange={(e) =>
                                                this.setState({
                                                    newHodEmail: e.target.value,
                                                })
                                            }
                                        />
                                    </div>
                                </div>

                                {/* <div className="col-md-6">
                                    <label className="mt-3 mr-2 ">
                                        <b>Select Department:</b>
                                    </label>

                                    <div className="">
                                        <select
                                            name="department"
                                            className="form-control"
                                            onChange={(e) =>
                                                this.setState({
                                                    newHodDepartment: e.target.value,
                                                })
                                            }
                                        >
                                            <option value="">Select Department</option>
                                            {this.state.allDepartments
                                                ? this.state.allDepartments.map((department, index) => {
                                                      return (
                                                          <option value={department.id} key={index}>
                                                              {department.name}
                                                          </option>
                                                      );
                                                  })
                                                : null}
                                        </select>
                                    </div>
                                </div> */}

                                <div className="col-md-6 mt-5">
                                    {this.state.newHodFormIncomplete ? (
                                        <div className="bg-danger border-rad-full text-center p-2 mb-3 custom-form-alert">
                                            <p className="small text-white mb-0">
                                                <Unicons.UilExclamationCircle size="20" /> Please fill in all fields.
                                            </p>
                                        </div>
                                    ) : null}

                                    {this.state.error ? (
                                        <div className="bg-danger border-rad-full text-center p-2 mb-3">
                                            <p className="small text-white mb-0">
                                                <Unicons.UilBell size="20" /> {this.state.errorMessage}
                                            </p>
                                        </div>
                                    ) : null}
                                </div>
                            </div>
                        </ModalBody>

                        <ModalFooter>
                            <button className="btn btn-primary">
                                Save <i className="fa fa-save" />
                                {this.state.newHodLoading ? (
                                    <span className="ml-2">
                                        <ClipLoader size={20} color={"#fff"} Loading={this.state.newHodLoading} />
                                    </span>
                                ) : null}
                            </button>

                            <button type="button" className="btn btn-danger" onClick={this.toggleNewHod}>
                                Close
                            </button>
                        </ModalFooter>
                    </form>
                </Modal>

                <Modal isOpen={this.state.assignHod} toggle={this.toggleAssignHod} className="mt-5 md" size="lg">
                    <form onSubmit={(e) => this.assignHod(e)}>
                        <ModalHeader toggle={this.toggleAssignHod}>
                            <span className="h2">Delegate Task to Sub-Admin</span>
                        </ModalHeader>

                        <ModalBody>
                            <div className="form-group row">
                                {/* <div className="col-md-6">
                                    <label className="mt-3 mr-2 ">
                                        <b>Select Sub-Admin:</b>
                                    </label>
                                    <Autocomplete
                                        id="controllable-states-demo"
                                        getOptionLabel={(option) => option.fullName}
                                        options={this.state.InstitutionStaff}
                                        onChange={(e, val) => {
                                            this.resolveAutoCompleteSelect(val);
                                        }}
                                        renderInput={(params) => <TextField {...params} onChange={(params) => this.executeSearch(params)} label="Select Sub-Admin" />}
                                    />
                                </div> */}
                                <div className="col-md-6">
                                    <label className="mt-3 mr-2 ">
                                        <b>Select Admin:</b>
                                    </label>

                                    <div className="">
                                        <select
                                            name="selectedUserId"
                                            className="form-control"
                                            onChange={(e) =>
                                                this.setState({
                                                    selectedUserId: e.target.value,
                                                })
                                            }
                                        >
                                            <option value="">Select Admin</option>
                                            {this.state.responseList && this.state.responseList.map((x) => {
                                                    return (
                                                        <option value={x.userId}>
                                                            {x.name}
                                                        </option>
                                                    );
                                                })
                                                }
                                        </select>
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <label className="mt-3 mr-2 ">
                                        <b>Select Task:</b>
                                    </label>

                                    <div className="">
                                        <select
                                            name="department"
                                            className="form-control"
                                            onChange={(e) =>
                                                this.setState({
                                                    selectedTaskId: e.target.value,
                                                })
                                            }
                                        >
                                            <option value="">Select Task</option>
                                            {roleTaskList
                                                ? roleTaskList.map((x, index) => {
                                                    return (
                                                        <option value={x.id} key={index}>
                                                            {x.name}
                                                        </option>
                                                    );
                                                })
                                                : null}
                                        </select>
                                    </div>
                                </div>


                            </div>
                        </ModalBody>

                        <ModalFooter>
                            <button className="btn btn-primary" onClick={this.executeDelegateTask}>
                                Confirm
                                {this.state.assignHodLoading ? (
                                    <span className="ml-2">
                                        <ClipLoader size={20} color={"#fff"} Loading={this.state.assignHodLoading} />
                                    </span>
                                ) : null}
                            </button>

                            <button type="button" className="btn btn-danger" onClick={this.toggleAssignHod}>
                                Close
                            </button>
                        </ModalFooter>
                    </form>
                </Modal>

                <Modal isOpen={this.state.editDepartment} toggle={this.toggleEditDepartment} className="mt-5 md">
                    <form onSubmit={(e) => this.editDepartment(e)}>
                        <ModalHeader toggle={this.toggleEditDepartment}>
                            <span className="h2">Edit Department Name</span>
                        </ModalHeader>

                        <ModalBody>
                            <div className="form-group">
                                <label className="mt-2 mr-2 ">
                                    <b>Department Name:</b>
                                </label>

                                <div className="custom-form-alert">
                                    {this.state.editDepartmentFormIncomplete ? (
                                        <div className="bg-danger border-rad-full text-center p-2 mb-3 custom-form-alert">
                                            <p className="small text-white mb-0">
                                                <Unicons.UilExclamationCircle size="20" /> Please enter a new faculty name.
                                            </p>
                                        </div>
                                    ) : null}

                                    {this.state.error ? (
                                        <div className="bg-danger border-rad-full text-center p-2 mb-3">
                                            <p className="small text-white mb-0">
                                                <Unicons.UilExclamationCircle size="20" /> {this.state.errorMessage}
                                            </p>
                                        </div>
                                    ) : null}

                                    <input
                                        id="clearName"
                                        type="text"
                                        className="form-control"
                                        value={this.state.editingDepartmentName}
                                        onChange={(e) =>
                                            this.setState({
                                                editingDepartmentName: e.target.value,
                                            })
                                        }
                                    />
                                </div>
                            </div>
                        </ModalBody>

                        <ModalFooter>
                            <button className="btn btn-primary">
                                Edit Department
                                {this.state.editDepartmentLoading ? (
                                    <span className="ml-2">
                                        <ClipLoader size={20} color={"#fff"} Loading={this.state.editDepartmentLoading} />
                                    </span>
                                ) : null}
                            </button>

                            <button type="button" className="btn btn-danger" onClick={this.toggleEditDepartment}>
                                Close
                            </button>
                        </ModalFooter>
                    </form>
                </Modal>

                <Modal isOpen={this.state.deleteHodModal} toggle={this.toggleDeleteDepartment} className="mt-5 md" size="sm">
                    <form onSubmit={(e) => this.deleteHod(e)}>
                        <ModalHeader toggle={this.toggleDeleteDepartment}>
                            <span className="h2">Unassign HOD {this.state.departmentName}?</span>
                        </ModalHeader>

                        <ModalBody>
                            <div className="text-center">
                                <h4>Are you sure?</h4>
                                <p>This action cannot be undone.</p>

                                {this.state.deleteDepartmentFormIncomplete ? (
                                    <div className="bg-danger border-rad-full text-center p-2 mb-3 custom-form-alert">
                                        <p className="small text-white mb-0">
                                            <Unicons.UilExclamationCircle size="20" /> Please select a department to delete...
                                        </p>
                                    </div>
                                ) : null}

                                {this.state.error ? (
                                    <div className="bg-danger border-rad-full text-center p-2 mb-3">
                                        <p className="small text-white mb-0">
                                            <Unicons.UilExclamationCircle size="20" /> {this.state.errorMessage}
                                        </p>
                                    </div>
                                ) : null}
                            </div>
                        </ModalBody>

                        <ModalFooter>
                            <button className="btn btn-primary">
                                Unassign HOD
                                {this.state.deleteDepartmentLoading ? (
                                    <span className="ml-2">
                                        <ClipLoader size={20} color={"#fff"} Loading={this.state.deleteDepartmentLoading} />
                                    </span>
                                ) : null}
                            </button>

                            <button type="button" className="btn btn-danger" onClick={() => this.openDeleteHod(false)}>
                                Close
                            </button>
                        </ModalFooter>
                    </form>
                </Modal>

                <Modal isOpen={this.state.showManageAdmin} toggle={this.toggleManageAdmin} className="mt-5 md" size="md">
                    <form onSubmit={(e) => this.deleteHod(e)}>
                        <ModalHeader toggle={this.toggleDeleteDepartment}>
                            <span className="h3">Admin privileges for {this.state.personName}</span>
                        </ModalHeader>

                        <ModalBody>
                            <div className="container-fluid">
                                <table className="table">
                                    <thead>
                                        <th>Task Name</th>
                                        <th>&nbsp;</th>
                                    </thead>
                                    <tbody>
                                        {this.state.delegations && this.state.delegations.map((x, i) => {
                                            return (
                                                <>
                                                    <tr>
                                                        <td>
                                                            {x.taskId == roleTask.school_dept_setup ? "School/Department Setup" 
                                                            : x.taskId == roleTask.hod_management ? "HOD/Department Admin Management" 
                                                            : x.taskId == roleTask.instructor_management ? "Instructor/Lecturer Management" 
                                                            : x.taskId == roleTask.student_management ? "Student Management" 
                                                            : x.taskId == roleTask.session_semester_setup ? "Session/Semester Setup" 
                                                            : x.taskId == roleTask.report_mgt ? "Report Administrator" 
                                                            : null}
                                                            {/* {x.taskId} */}
                                                        </td>
                                                        <td><button type="button" onClick={() => this.revokeAdminPrivilege(x.delegationId)} className="btn btn-danger btn-sm">{this.state.btnLoading ? "Revoking..." : "Revoke"}</button></td>
                                                    </tr>
                                                </>
                                            )
                                        })}

                                    </tbody>
                                </table>
                            </div>
                            {/* <div className="row">
                            <div className="col-sm-12">
                                    <label className="mt-3 mr-2 ">
                                        <b>Select Department:</b>
                                    </label>

                                    <div className="">
                                        <select
                                            name="department"
                                            className="form-control"
                                            onChange={(e) =>
                                                this.setState({
                                                    assignHodDepartment: e.target.value,
                                                })
                                            }
                                        >
                                            <option value="">Select Department</option>
                                            {this.state.allDepartments
                                                ? this.state.allDepartments.map((department, index) => {
                                                      return (
                                                          <option value={department.id} key={index}>
                                                              {department.name}
                                                          </option>
                                                      );
                                                  })
                                                : null}
                                        </select>
                                    </div>
                                </div>
                            </div> */}

                        </ModalBody>

                        <ModalFooter style={{ visibility: "hidden" }}>
                            <button className="btn btn-primary">
                                Unassign HOD
                                {this.state.deleteDepartmentLoading ? (
                                    <span className="ml-2">
                                        <ClipLoader size={20} color={"#fff"} Loading={this.state.deleteDepartmentLoading} />
                                    </span>
                                ) : null}
                            </button>

                            <button type="button" className="btn btn-danger" onClick={() => this.openDeleteHod(false)}>
                                Close
                            </button>
                        </ModalFooter>
                    </form>
                </Modal>
            </>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SubAdmins);
