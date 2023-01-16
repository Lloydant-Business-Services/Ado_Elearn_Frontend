import React, {Component} from 'react';
import {connect} from "react-redux";
import {mapDispatchToProps, mapStateToProps, stateKeys} from "../../redux/actions";
import illustration from "../../assets/images/illus.png"
import * as Unicons from '@iconscout/react-unicons';
import Endpoint from "../../utils/endpoint";
import toast, {Toaster} from "react-hot-toast";
import ClipLoader from "react-spinners/ClipLoader";
import {Modal, ModalBody, ModalFooter, ModalHeader} from "reactstrap";
import {Link} from "react-router-dom";
import Spinner from "../Front/Spinner"
import Select from 'react-select';

class MaterialBank extends Component {
	state = {
		pageLoading: false,
		
		topicContent: [],
		
		thisTopic: [],
		newContentName: '',
		newContentVidLink: '',
		newContentStreamLink: '',
		newContentNote: null,
		newContentLoading: false
	};
	
	loadDataError = (error) => toast.error("Something went wrong, pls check your connection.", {
		style: {
			border: '1px solid #DC2626',
			padding: '16px',
			background: '#DC2626',
			color: '#fff',
			borderRadius: '3rem',
		},
		iconTheme: {
			primary: '#FFFAEE',
			secondary: '#DC2626',
		},
	});
	
	openNewContent = () => { this.setState({newContent: true}) };
	
	toggleNewContent = () => { this.setState({newContent: !this.state.newContent}) };
	
	contentFileSelect = (e) => {
		this.setState({newContentNote: e.target.files[0]});
		console.log(e.target.files[0])
	};
	
	newContentSuccess = () => toast.success("Content added successfully", {
		style: {
			border: '1px solid #56b39d',
			padding: '16px',
			background: '#56b39d',
			color: '#fff',
			borderRadius: '2rem',
		},
		iconTheme: {
			primary: '#FFFAEE',
			secondary: '#56b39d',
		},
	});
	
	transferSuccess = (data) => toast.success(data, {
		style: {
			border: '1px solid #56b39d',
			padding: '16px',
			background: '#56b39d',
			color: '#fff',
			borderRadius: '2rem',
		},
		iconTheme: {
			primary: '#FFFAEE',
			secondary: '#56b39d',
		},
	});
	createContent = (e) => {
		e.preventDefault();
		
		if (!this.state.newContentName) {
			this.setState({newContentFormIncomplete: true});
			
			setTimeout(() => {
				this.setState({newContentFormIncomplete: false});
			}, 3000);
			
			return;
		}
		//console.log(this.state.newContentNote.size, "size")
		if (this.state.newContentNote && this.state.newContentNote.size > 10000000) {
			this.setState({error: true, errorMessage: "File size cannot exceed 10MB"});
			
			setTimeout(() => {
				this.setState({error: false, errorMessage: ""});
			}, 3000);
			return;
		}
		this.setState({newContentLoading: true, success: false, error: false});
		
		let ContentProps = new FormData;
		ContentProps.append("CourseTopicId", this.state.thisTopic.topicId);
		ContentProps.append("ContentTitle", this.state.newContentName);
		
		if (this.state.newContentNote) {
			ContentProps.append("Note", this.state.newContentNote);
		}
		
		if (this.state.newContentVidLink) {
			ContentProps.append("VideoLink", this.state.newContentVidLink);
		}
		
		if (this.state.newContentStreamLink) {
			ContentProps.append("StreamLink", this.state.newContentStreamLink);
		}
		
		
		console.log(this.state.newContentNote);
		Endpoint.createTopicContent(ContentProps)
			.then((res) => {
				console.log(res);
				this.setState({newContentLoading: false, newContent: false});
				this.newContentSuccess();
				
				setTimeout(() => {
					this.loadDataFromServer()
				}, 2000);
			})
			.catch((error) => {
				this.loadDataError(error, this);
				this.setState({newContentLoading: false, })
			});
	};
	toggleAssignCourse = (data) => {
		this.setState({assignCourse: !this.state.assignCourse, allocationTarget:false, contentId: data.contentId})
	};
	loadDataFromServer = () => {
		let user = JSON.parse(localStorage.getItem('user'));
		this.setState({pageLoading: true, user: user});
		Endpoint.getAllTopicContentByInstructor(user?.userId)
			.then((res) => {
				console.log(res.data);
				this.setState({pageLoading: false, topicContent: res.data})
			})
			.catch((error) => {
				this.loadDataError(error, this);
				this.setState({pageLoading: false, })
			});
	};

	loadCourseTopics = () => {
		let user = JSON.parse(localStorage.getItem('user'));
		Endpoint.getCourseTopicsByInstructor(user?.userId)
		.then((res) => {
			console.log(res.data)
			let newInstructorObj = [];
						for (let i=0; i<res.data.length; i++) {
							let entry = {value: res.data[i].topicId, label: res.data[i].courseCode + "- " + res.data[i].courseTitle };
							newInstructorObj.push(entry);
						}
						this.setState({allCourses: res.data, allCoursesSelect: newInstructorObj, pageLoading: false});
		})
		.catch((err) => {
			console.log(err)
		})
	}
	
	triggerCourseMaterialTRansfer = (e) => {
		e.preventDefault()
		this.setState({
			newContentLoading:true
		})
		Endpoint.transferCourseMaterial(this.state.contentId, this.state.newTopicId)
		.then((res) => {
			this.setState({
				newContentLoading:false,
				assignCourse:false
			})
			this.transferSuccess("Course material transfer successful!")
			this.loadDataFromServer()
		})
		.catch((err) => {
			console.log(err)
		})
	}
	componentDidMount() {
		this.loadDataFromServer()
		this.loadCourseTopics()
	}

	setAssignCourseId = (e) => {
		if (e) {
			this.setState({newTopicId: e.value});
		}
	};
	
	render() {
		return (
			<>
				                {this.state.pageLoading ? <Spinner message={"Just a moment"} /> : null}

				
				<Toaster
					position="top-center"
					reverseOrder={false}
				/>
				
				<div className="container-fluid py-5">
					<div className="d-flex flex-wrap justify-content-between">
						<h1 className="mb-3 text-primary">
							 <span className="h2">Course Material Store</span>
						</h1>
						
						<div>
							{/* <button className="btn btn-primary" onClick={this.openNewContent}>
								<Unicons.UilPlus size="20"/> New Content
							</button> */}
						</div>
					</div>
					
					<hr className="my-3"/>
					
					<div className="row">
						{
							this.state.topicContent && this.state.topicContent.length > 0 ?
								this.state.topicContent.map((content, index) => {
									return (
										<div className="col-xl-3 col-lg-4 col-md-6 my-3" key={index}>
											<div className="card bg-custom-light">
												<div className="card-body">
													<h3>{content.contentTitle}</h3>
													
													{
														content.videoLink ?
															<h5>
																<a href={content.videoLink} target="_blank">
																	Video Link <Unicons.UilExternalLinkAlt size="20"/>
																</a>
															</h5>
														: null
													}
													
													{
														content.liveStreamLink ?
															<h5>
																<a href={content.liveStreamLink} target="_blank">
																	Live Stream <Unicons.UilExternalLinkAlt size="20"/>
																</a>
															</h5>
														: null
													}
													
													{
														content.noteLink ?
															<h5>
																<a href={content.noteLink} target="_blank">
																	Content File <Unicons.UilExternalLinkAlt size="20"/>
																</a>
															</h5>
														: null
													}
													
												</div>
											</div>
											<button className='btn btn-sm' onClick={() => this.toggleAssignCourse(content)}>Import to current session</button>
										</div>
									)
								})
								:
								<div className="col-12">
									<p className="text-center mt-4">No content available</p>
								</div>
						}
					</div>
				</div>
				<Modal isOpen={this.state.assignCourse} toggle={this.toggleAssignCourse} className="mt-5 md" size="md">
					<form onSubmit={(e) => this.triggerCourseMaterialTRansfer(e)}>
						<ModalHeader toggle={this.toggleAssignCourse}>
							<span className="h2">Select Target Course</span>
						</ModalHeader>
						
						<ModalBody>
							<div className="form-group row">
								<div className="col-md-12">
									<label className="mt-2 mr-2 ">
										<b>Select Course:</b>
									</label>
									
									<div className="">
										<Select
											className="basic-single"
											classNamePrefix="select"
											defaultValue={0}
											isDisabled={false}
											isLoading={false}
											isClearable={true}
											isRtl={false}
											isSearchable={true}
											name="Course"
											options={this.state.allCoursesSelect}
											onChange={this.setAssignCourseId }
										/>
									</div>
								</div>
								
								{/* <div className="col-md-6">
									<label className="mt-2 mr-2 ">
										<b>Select Instructor:</b>
									</label>
									
									<div className="">
										<Select
											className="basic-single"
											classNamePrefix="select"
											defaultValue={0}
											isDisabled={false}
											isLoading={false}
											isClearable={true}
											isRtl={false}
											isSearchable={true}
											name="Course"
											options={this.state.allInstructorNames}
											onChange={ this.setAssignInstructorId}
										/>
									</div>
								</div> */}
								
								
								{/* <div className="col-md-6">
									<label className="mt-4 mr-2">
										<b>Select Level:</b>
									</label>
									
									<select className="form-control" style={{borderRadius: 5}} onChange={(e) => this.setState({assignLevelId: e.target.value})}>
										<option value="">Select a level</option>
										{
											this.state.allLevels && this.state.allLevels.length ?
												this.state.allLevels.map((level, index) => {
													return (
														<option value={level.id} key={index}>{level.name}</option>
													)
												})
												:
												null
										}
									</select>
								</div> */}
								
								
								<div className="col-md-6">
									<div className="mt-5">
										{this.state.assignCourseFormIncomplete ?
											<div
												className="bg-danger border-rad-full text-center p-2 mb-3 custom-form-alert">
												<p className="small text-white mb-0">
													<Unicons.UilExclamationCircle size="20"/> Please fill in all fields.
												</p>
											</div>
											: null
										}
										
										{this.state.error ?
											<div className="bg-danger border-rad-full text-center p-2 mb-3">
												<p className="small text-white mb-0">
													<Unicons.UilBell size="20"/> {this.state.errorMessage}
												</p>
											</div>
											: null
										}
									</div>
								</div>
							</div>
						</ModalBody>
						
						<ModalFooter>
							<button className="btn btn-primary">
								Import
								{
									this.state.assignCourseLoading ?
										<span className="ml-2">
										<ClipLoader size={20} color={"#fff"}
													Loading={this.state.assignCourseLoading}/>
									</span>
										:
										null
								}
							</button>
							
							<button type="button" className="btn btn-danger" onClick={this.toggleAssignCourse}>Close</button>
						</ModalFooter>
					</form>
				</Modal>
				<Modal isOpen={this.state.newContent} toggle={this.toggleNewContent} className="mt-5 md" size="lg">
					<form onSubmit={(e) => this.createContent(e)}>
						<ModalHeader toggle={this.toggleNewContent}>
							<span className="h2">Add New Content</span>
						</ModalHeader>
						
						<ModalBody>
							<div className="form-group row">
								<div className="col-md-6">
									<label className="mt-2 mr-2 ">
										<b>Content Title:</b>
									</label>
									
									<input id="tName" type="text" className="form-control"
										   value={this.state.newContentName}
										   onChange={(e) => this.setState({
											   newContentName: e.target.value,
										   }) }
									/>
								</div>
								
								<div className="col-md-6">
									<label className="mt-2 mr-2 ">
										<b>Video Link:</b>
									</label>
									
									<input id="tName" type="text" className="form-control"
										   value={this.state.newContentVidLink}
										   onChange={(e) => this.setState({
											   newContentVidLink: e.target.value,
										   }) }
									/>
								</div>
								
								<div className="col-md-6 mt-3">
									<label className="mt-2 mr-2 ">
										<b>Stream Link:</b>
									</label>
									
									<input id="oName" type="text" className="form-control"
										   value={this.state.newContentStreamLink}
										   onChange={(e) => this.setState({
											   newContentStreamLink: e.target.value,
										   }) }
									/>
								</div>
								
								<div className="col-md-6 mt-3">
									<label className="mt-2 mr-2 ">
										<b>Note: <span className="text-danger small">Accept: PDF, docx, txt</span></b>
									</label>
									
									<input type="file" className="form-control" 
									accept="application/pdf, application/docx, application/txt"
										   // onChange={(e) => this.setState({ newContentNote: e.target.value,}) }
										   onChange={e => { this.contentFileSelect(e) }}/>
								</div>
								
								<div className="col-md-6 offset-md-6 mt-3">
									{this.state.newContentFormIncomplete ?
										<div className="bg-danger border-rad-full text-center p-2 my-3">
											<p className="small text-white mb-0">
												<Unicons.UilExclamationCircle size="20"/> Please provide a Title and a Note or Link.
											</p>
										</div>
										: null
									}
									
									{this.state.error ?
										<div className="bg-danger border-rad-full text-center p-2 my-3">
											<p className="small text-white mb-0">
												<Unicons.UilBell size="20"/> {this.state.errorMessage}
											</p>
										</div>
										: null
									}
								</div>
							</div>
						</ModalBody>
						
						<ModalFooter>
							<button className="btn btn-primary">
								Add Content
								{
									this.state.newContentLoading ?
										<span className="ml-2">
										<ClipLoader size={20} color={"#fff"}
													Loading={this.state.newContentLoading}/>
									</span>
										:
										null
								}
							</button>
							
							<button type="button" className="btn btn-danger" onClick={this.toggleNewContent}>Close</button>
						</ModalFooter>
					</form>
				</Modal>
			
			</>
		)
	}
}

export default MaterialBank