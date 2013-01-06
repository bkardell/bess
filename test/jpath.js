var jpath, simpleObject, jpath_url = "src/jpath";

module('jpath', {
	setup: function(){
		simpleObject = {
			name: 'test',
			desc: 'simpleObject'
		};
		arrayOfComplexObjects = [{
			"name": "primary",
			"type": "menugroup",
			"path": "/content/tenant_831D8B107020BBEBE0400F0A32207789/navigation/primary",
			"tags": ["terms:categories/pagesection/footer"],
			"target": null,
			"shortDescription": null,
			"status": null,
			"longDescription": null,
			"uri": null,
			"menuItems": {
				"primary": [{
					"contentArea": "classroom",
					"name": null,
					"type": "menuitem",
					"path": "/content/tenant_831D8B107020BBEBE0400F0A32207789/navigation/primary/classroom",
					"tags": ["terms:categories/pagesection/footer","terms:categories/pagesection/header"],
					"target": "_parent",
					"shortDescription": null,
					"status": null,
					"longDescription": null,
					"uri": "{classroomurl}/classroom/ic/classroom.aspx",
					"menuItems": {},
					"menuTitle": "Classroom",
					"tooltip": null,
					"createdBy": "admin",
					"dateCreated": "Thu Jul 28 2011 13:06:42 GMT-0700",
					"dateModified": "Tue Jul 19 2011 09:47:46 GMT-0700",
					"modifiedBy": "admin",
					"pageContent": null,
					"keywords": null,
					"menuDescription": null,
					"htmlContent": null
				}, {
					"contentArea": "home",
					"name": null,
					"type": "menuitem",
					"path": "/content/tenant_831D8B107020BBEBE0400F0A32207789/navigation/primary/home",
					"tags": ["terms:categories/pagesection/footer","terms:categories/pagesection/global"],
					"target": "_parent",
					"shortDescription": null,
					"status": null,
					"longDescription": null,
					"uri": "https://portal.qaols.phoenix.edu/home.html",
					"menuItems": {},
					"menuTitle": "Home",
					"tooltip": null,
					"createdBy": "admin",
					"dateCreated": "Thu Jul 28 2011 13:06:42 GMT-0700",
					"dateModified": "Tue Jul 19 2011 09:47:23 GMT-0700",
					"modifiedBy": "admin",
					"pageContent": null,
					"keywords": null,
					"menuDescription": null,
					"htmlContent": null
				}, {
					"contentArea": "resourcesFaculty",
					"name": "faculty",
					"type": "menugroup",
					"path": "/content/tenant_831D8B107020BBEBE0400F0A32207789/navigation/primary/faculty",
					"tags": ["terms:categories/pagesection/global","terms:categories/pagesection/global"],
					"target": null,
					"shortDescription": null,
					"status": null,
					"longDescription": null,
					"uri": "https://portal.qaols.phoenix.edu/faculty.html",
					"menuItems": {
						"faculty": [{
							"name": "secondary",
							"type": "menugroup",
							"path": "/content/tenant_831D8B107020BBEBE0400F0A32207789/navigation/primary/faculty/secondary",
							"tags": null,
							"target": null,
							"shortDescription": null,
							"status": null,
							"longDescription": null,
							"uri": null,
							"menuItems": {
								"secondary": [{
									"contentArea": "resourcesFaculty",
									"name": "Training and Development",
									"type": "menuitem",
									"path": "/content/tenant_831D8B107020BBEBE0400F0A32207789/navigation/primary/faculty/secondary/training_and_development",
									"tags": null,
									"target": "_parent",
									"shortDescription": null,
									"status": null,
									"longDescription": null,
									"uri": "https://portal.qaols.phoenix.edu/resources/faculty/training-development/index.html",
									"menuItems": {},
									"menuTitle": "Training & Development",
									"tooltip": null,
									"createdBy": "admin",
									"dateCreated": "Thu Jul 28 2011 13:06:43 GMT-0700",
									"dateModified": "Tue Jul 19 2011 09:51:34 GMT-0700",
									"modifiedBy": "admin",
									"pageContent": null,
									"keywords": null,
									"menuDescription": "Workshops, Certifications, Tutorials",
									"htmlContent": null
								}, {
									"contentArea": "resourcesFaculty",
									"name": "Course Scheduling",
									"type": "menuitem",
									"path": "/content/tenant_831D8B107020BBEBE0400F0A32207789/navigation/primary/faculty/secondary/course_scheduling",
									"tags": null,
									"target": "_parent",
									"shortDescription": null,
									"status": null,
									"longDescription": null,
									"uri": "https://portal.qaols.phoenix.edu/resources/faculty/course-scheduling/index.html",
									"menuItems": {},
									"menuTitle": "Course Scheduling",
									"tooltip": null,
									"createdBy": "admin",
									"dateCreated": "Thu Jul 28 2011 13:06:43 GMT-0700",
									"dateModified": "Tue Jul 19 2011 09:52:10 GMT-0700",
									"modifiedBy": "admin",
									"pageContent": null,
									"keywords": null,
									"menuDescription": "Content Area Requests, Solicitations, Submit Availability",
									"htmlContent": null
								}, {
									"contentArea": "resourcesFaculty",
									"name": "Classroom Resources",
									"type": "menuitem",
									"path": "/content/tenant_831D8B107020BBEBE0400F0A32207789/navigation/primary/faculty/secondary/classroom_resources",
									"tags": null,
									"target": "_parent",
									"shortDescription": null,
									"status": null,
									"longDescription": null,
									"uri": "https://portal.qaols.phoenix.edu/resources/faculty/classroom-resources/index.html",
									"menuItems": {},
									"menuTitle": "Classroom Resources",
									"tooltip": null,
									"createdBy": "admin",
									"dateCreated": "Thu Jul 28 2011 13:06:43 GMT-0700",
									"dateModified": "Tue Jul 19 2011 09:51:50 GMT-0700",
									"modifiedBy": "admin",
									"pageContent": null,
									"keywords": null,
									"menuDescription": "Preparation, Instruction, Management, Assessment and Student Issues",
									"htmlContent": null
								}, {
									"contentArea": "resourcesFaculty",
									"name": "humanresources",
									"type": "menuitem",
									"path": "/content/tenant_831D8B107020BBEBE0400F0A32207789/navigation/primary/faculty/secondary/human_resources",
									"tags": null,
									"target": "_parent",
									"shortDescription": null,
									"status": null,
									"longDescription": null,
									"uri": "https://portal.qaols.phoenix.edu/resources/faculty/human-resources/index.html",
									"menuItems": {},
									"menuTitle": "Human Resources",
									"tooltip": null,
									"createdBy": "admin",
									"dateCreated": "Thu Jul 28 2011 13:06:43 GMT-0700",
									"dateModified": "Tue Jul 19 2011 09:51:14 GMT-0700",
									"modifiedBy": "admin",
									"pageContent": null,
									"keywords": null,
									"menuDescription": "Benefits, Compensation, Policies and Forms",
									"htmlContent": null
								}, {
									"contentArea": "resourcesFaculty",
									"name": "Faculty Handbook",
									"type": "menuitem",
									"path": "/content/tenant_831D8B107020BBEBE0400F0A32207789/navigation/primary/faculty/secondary/faculty_handbook",
									"tags": null,
									"target": "_parent",
									"shortDescription": null,
									"status": null,
									"longDescription": null,
									"uri": "https://portal.qaols.phoenix.edu/resources/faculty/faculty-handbook/index.html",
									"menuItems": {},
									"menuTitle": "Faculty Handbook",
									"tooltip": null,
									"createdBy": "admin",
									"dateCreated": "Thu Jul 28 2011 13:06:43 GMT-0700",
									"dateModified": "Tue Jul 19 2011 09:52:26 GMT-0700",
									"modifiedBy": "admin",
									"pageContent": null,
									"keywords": null,
									"menuDescription": null,
									"htmlContent": null
								}]
							},
							"menuTitle": "Secondary",
							"tooltip": null,
							"createdBy": "admin",
							"dateCreated": "Thu Jul 28 2011 13:06:43 GMT-0700",
							"dateModified": "Tue Jul 19 2011 09:50:50 GMT-0700",
							"modifiedBy": "admin",
							"pageContent": null,
							"keywords": null,
							"menuDescription": null,
							"htmlContent": null
						}, {
							"name": "training_and_development",
							"type": "menugroup",
							"path": "/content/tenant_831D8B107020BBEBE0400F0A32207789/navigation/primary/faculty/training_and_development",
							"tags": null,
							"target": null,
							"shortDescription": null,
							"status": null,
							"longDescription": null,
							"uri": null,
							"menuItems": {
								"training_and_development": [{
									"name": "forums",
									"type": "menugroup",
									"path": "/content/tenant_831D8B107020BBEBE0400F0A32207789/navigation/primary/faculty/training_and_development/forums",
									"tags": null,
									"target": null,
									"shortDescription": null,
									"status": null,
									"longDescription": null,
									"uri": null,
									"menuItems": {},
									"menuTitle": "forums",
									"tooltip": null,
									"createdBy": "admin",
									"dateCreated": "Fri Aug 19 2011 09:04:50 GMT-0700",
									"dateModified": "Thu Aug 04 2011 15:25:14 GMT-0700",
									"modifiedBy": "admin",
									"pageContent": null,
									"keywords": null,
									"menuDescription": "forums",
									"htmlContent": null
								}, {
									"name": "Tutorials",
									"type": "menugroup",
									"path": "/content/tenant_831D8B107020BBEBE0400F0A32207789/navigation/primary/faculty/training_and_development/tutorials",
									"tags": null,
									"target": null,
									"shortDescription": null,
									"status": null,
									"longDescription": null,
									"uri": null,
									"menuItems": {},
									"menuTitle": "Tutorials",
									"tooltip": null,
									"createdBy": "admin",
									"dateCreated": "Fri Aug 19 2011 09:04:50 GMT-0700",
									"dateModified": "Thu Aug 04 2011 15:25:14 GMT-0700",
									"modifiedBy": "admin",
									"pageContent": null,
									"keywords": null,
									"menuDescription": "Tutorials",
									"htmlContent": null
								}, {
									"name": "workshops",
									"type": "menugroup",
									"path": "/content/tenant_831D8B107020BBEBE0400F0A32207789/navigation/primary/faculty/training_and_development/workshops",
									"tags": null,
									"target": null,
									"shortDescription": null,
									"status": null,
									"longDescription": null,
									"uri": null,
									"menuItems": {},
									"menuTitle": "workshops",
									"tooltip": null,
									"createdBy": "admin",
									"dateCreated": "Fri Aug 19 2011 09:04:50 GMT-0700",
									"dateModified": "Thu Aug 04 2011 13:41:49 GMT-0700",
									"modifiedBy": "admin",
									"pageContent": null,
									"keywords": null,
									"menuDescription": null,
									"htmlContent": null
								}, {
									"name": "Ongoing Faculty Development",
									"type": "menugroup",
									"path": "/content/tenant_831D8B107020BBEBE0400F0A32207789/navigation/primary/faculty/training_and_development/ongoing_faculty_deve",
									"tags": null,
									"target": null,
									"shortDescription": null,
									"status": null,
									"longDescription": null,
									"uri": null,
									"menuItems": {},
									"menuTitle": "Ongoing Faculty Development",
									"tooltip": null,
									"createdBy": "admin",
									"dateCreated": "Fri Aug 19 2011 09:04:50 GMT-0700",
									"dateModified": "Thu Aug 04 2011 13:51:58 GMT-0700",
									"modifiedBy": "admin",
									"pageContent": null,
									"keywords": null,
									"menuDescription": "Ongoing Faculty Development",
									"htmlContent": null
								}, {
									"name": "Certifications",
									"type": "menugroup",
									"path": "/content/tenant_831D8B107020BBEBE0400F0A32207789/navigation/primary/faculty/training_and_development/certifications",
									"tags": null,
									"target": null,
									"shortDescription": null,
									"status": null,
									"longDescription": null,
									"uri": null,
									"menuItems": {},
									"menuTitle": "Certifications",
									"tooltip": null,
									"createdBy": "admin",
									"dateCreated": "Fri Aug 19 2011 09:04:50 GMT-0700",
									"dateModified": "Thu Aug 04 2011 15:25:14 GMT-0700",
									"modifiedBy": "admin",
									"pageContent": null,
									"keywords": null,
									"menuDescription": "Certifications",
									"htmlContent": null
								}]
							},
							"menuTitle": "Training and Development",
							"tooltip": null,
							"createdBy": "admin",
							"dateCreated": "Fri Aug 19 2011 09:04:50 GMT-0700",
							"dateModified": "Mon Aug 01 2011 11:30:55 GMT-0700",
							"modifiedBy": "admin",
							"pageContent": null,
							"keywords": null,
							"menuDescription": null,
							"htmlContent": null
						}, {
							"name": "Human Resources",
							"type": "menugroup",
							"path": "/content/tenant_831D8B107020BBEBE0400F0A32207789/navigation/primary/faculty/humanresources",
							"tags": null,
							"target": null,
							"shortDescription": null,
							"status": null,
							"longDescription": null,
							"uri": null,
							"menuItems": {
								"humanresources": [{
									"name": "Policies",
									"type": "menugroup",
									"path": "/content/tenant_831D8B107020BBEBE0400F0A32207789/navigation/primary/faculty/humanresources/policies",
									"tags": null,
									"target": null,
									"shortDescription": null,
									"status": null,
									"longDescription": null,
									"uri": null,
									"menuItems": {},
									"menuTitle": "Policies",
									"tooltip": null,
									"createdBy": "admin",
									"dateCreated": "Thu Jul 28 2011 13:06:43 GMT-0700",
									"dateModified": "Mon Jul 11 2011 10:02:44 GMT-0700",
									"modifiedBy": "admin",
									"pageContent": null,
									"keywords": null,
									"menuDescription": null,
									"htmlContent": null
								}, {
									"name": "Compensation",
									"type": "menugroup",
									"path": "/content/tenant_831D8B107020BBEBE0400F0A32207789/navigation/primary/faculty/humanresources/compensation",
									"tags": null,
									"target": null,
									"shortDescription": null,
									"status": null,
									"longDescription": null,
									"uri": "#",
									"menuItems": {},
									"menuTitle": "Compensation",
									"tooltip": "Compensation",
									"createdBy": "admin",
									"dateCreated": "Thu Jul 28 2011 13:06:43 GMT-0700",
									"dateModified": "Sun Aug 21 2011 16:58:49 GMT-0700",
									"modifiedBy": "admin",
									"pageContent": null,
									"keywords": null,
									"menuDescription": "Compensation",
									"htmlContent": null
								}, {
									"name": "Benefits",
									"type": "menugroup",
									"path": "/content/tenant_831D8B107020BBEBE0400F0A32207789/navigation/primary/faculty/humanresources/benefits",
									"tags": null,
									"target": null,
									"shortDescription": null,
									"status": null,
									"longDescription": null,
									"uri": null,
									"menuItems": {},
									"menuTitle": "Benefits",
									"tooltip": null,
									"createdBy": "admin",
									"dateCreated": "Thu Jul 28 2011 13:06:43 GMT-0700",
									"dateModified": "Sun Aug 21 2011 17:03:25 GMT-0700",
									"modifiedBy": "admin",
									"pageContent": null,
									"keywords": null,
									"menuDescription": null,
									"htmlContent": null
								}, {
									"name": "Employment Verification",
									"type": "menuitem",
									"path": "/content/tenant_831D8B107020BBEBE0400F0A32207789/navigation/primary/faculty/humanresources/employmentverification",
									"tags": null,
									"target": null,
									"shortDescription": null,
									"status": null,
									"longDescription": null,
									"uri": "https://ecampus.qaols.phoenix.edu/secure/faculty/benefits/verification.asp",
									"menuItems": {},
									"menuTitle": "Employment Verification",
									"tooltip": "Employment Verification",
									"createdBy": "admin",
									"dateCreated": "Thu Jul 28 2011 13:06:43 GMT-0700",
									"dateModified": "Thu Jul 07 2011 16:15:12 GMT-0700",
									"modifiedBy": "admin",
									"pageContent": null,
									"keywords": null,
									"menuDescription": null,
									"htmlContent": null
								}, {
									"name": "Forms",
									"type": "menugroup",
									"path": "/content/tenant_831D8B107020BBEBE0400F0A32207789/navigation/primary/faculty/humanresources/forms",
									"tags": null,
									"target": null,
									"shortDescription": null,
									"status": null,
									"longDescription": null,
									"uri": "https://ecampus.qaols.phoenix.edu/content/FAAccount/Faculty/facforms.aspx",
									"menuItems": {},
									"menuTitle": "Forms",
									"tooltip": "Forms",
									"createdBy": "admin",
									"dateCreated": "Thu Jul 28 2011 13:06:43 GMT-0700",
									"dateModified": "Mon Jul 11 2011 10:12:37 GMT-0700",
									"modifiedBy": "admin",
									"pageContent": null,
									"keywords": ["Tax forms", "direct deposit", "W4", "state"],
									"menuDescription": "Forms",
									"htmlContent": null
								}]
							},
							"menuTitle": "Human Resources",
							"tooltip": null,
							"createdBy": "admin",
							"dateCreated": "Thu Jul 28 2011 13:06:43 GMT-0700",
							"dateModified": "Sun Aug 21 2011 16:57:27 GMT-0700",
							"modifiedBy": "admin",
							"pageContent": null,
							"keywords": ["{}"],
							"menuDescription": null,
							"htmlContent": null
						}, {
							"name": "Classroom",
							"type": "menugroup",
							"path": "/content/tenant_831D8B107020BBEBE0400F0A32207789/navigation/primary/faculty/classroom",
							"tags": null,
							"target": null,
							"shortDescription": null,
							"status": null,
							"longDescription": null,
							"uri": null,
							"menuItems": {
								"classroom": [{
									"name": "Instruction",
									"type": "menugroup",
									"path": "/content/tenant_831D8B107020BBEBE0400F0A32207789/navigation/primary/faculty/classroom/instruction",
									"tags": [],
									"target": "_parent",
									"shortDescription": null,
									"status": "draft",
									"longDescription": null,
									"uri": null,
									"menuItems": {},
									"menuTitle": "Instruction",
									"tooltip": null,
									"createdBy": "admin",
									"dateCreated": "Thu Jul 28 2011 13:06:42 GMT-0700",
									"dateModified": "Sun Aug 21 2011 16:59:36 GMT-0700",
									"modifiedBy": "admin",
									"pageContent": null,
									"keywords": ["{}"],
									"menuDescription": null,
									"htmlContent": null
								}, {
									"name": "Classroom Forms",
									"type": "menugroup",
									"path": "/content/tenant_831D8B107020BBEBE0400F0A32207789/navigation/primary/faculty/classroom/classroomforms",
									"tags": null,
									"target": null,
									"shortDescription": null,
									"status": null,
									"longDescription": null,
									"uri": null,
									"menuItems": {},
									"menuTitle": "Classroom Forms",
									"tooltip": "Classroom Forms",
									"createdBy": "admin",
									"dateCreated": "Thu Jul 28 2011 13:06:42 GMT-0700",
									"dateModified": "Sun Aug 21 2011 17:00:14 GMT-0700",
									"modifiedBy": "admin",
									"pageContent": null,
									"keywords": null,
									"menuDescription": null,
									"htmlContent": null
								}, {
									"name": "Student Issues",
									"type": "menugroup",
									"path": "/content/tenant_831D8B107020BBEBE0400F0A32207789/navigation/primary/faculty/classroom/studentissues",
									"tags": null,
									"target": null,
									"shortDescription": null,
									"status": null,
									"longDescription": null,
									"uri": null,
									"menuItems": {},
									"menuTitle": "Student Issues",
									"tooltip": "Student Issues",
									"createdBy": "admin",
									"dateCreated": "Thu Jul 28 2011 13:06:42 GMT-0700",
									"dateModified": "Sun Aug 21 2011 12:12:09 GMT-0700",
									"modifiedBy": "admin",
									"pageContent": null,
									"keywords": null,
									"menuDescription": null,
									"htmlContent": null
								}, {
									"name": "Assessment",
									"type": "menugroup",
									"path": "/content/tenant_831D8B107020BBEBE0400F0A32207789/navigation/primary/faculty/classroom/assessment",
									"tags": null,
									"target": null,
									"shortDescription": null,
									"status": null,
									"longDescription": null,
									"uri": null,
									"menuItems": {},
									"menuTitle": "Assessment",
									"tooltip": "Assessment",
									"createdBy": "admin",
									"dateCreated": "Thu Jul 28 2011 13:06:42 GMT-0700",
									"dateModified": "Sun Aug 21 2011 16:59:49 GMT-0700",
									"modifiedBy": "admin",
									"pageContent": null,
									"keywords": null,
									"menuDescription": null,
									"htmlContent": null
								}, {
									"name": "Management",
									"type": "menugroup",
									"path": "/content/tenant_831D8B107020BBEBE0400F0A32207789/navigation/primary/faculty/classroom/management",
									"tags": null,
									"target": null,
									"shortDescription": null,
									"status": null,
									"longDescription": null,
									"uri": null,
									"menuItems": {},
									"menuTitle": "Management",
									"tooltip": "Management",
									"createdBy": "admin",
									"dateCreated": "Thu Jul 28 2011 13:06:42 GMT-0700",
									"dateModified": "Sun Aug 21 2011 12:12:25 GMT-0700",
									"modifiedBy": "admin",
									"pageContent": null,
									"keywords": null,
									"menuDescription": null,
									"htmlContent": null
								}, {
									"name": "Preparation",
									"type": "menugroup",
									"path": "/content/tenant_831D8B107020BBEBE0400F0A32207789/navigation/primary/faculty/classroom/preparation",
									"tags": null,
									"target": null,
									"shortDescription": null,
									"status": null,
									"longDescription": null,
									"uri": null,
									"menuItems": {},
									"menuTitle": "Preparattion",
									"tooltip": "Preparattion",
									"createdBy": "admin",
									"dateCreated": "Thu Jul 28 2011 13:06:42 GMT-0700",
									"dateModified": "Sun Aug 21 2011 12:09:58 GMT-0700",
									"modifiedBy": "admin",
									"pageContent": null,
									"keywords": null,
									"menuDescription": null,
									"htmlContent": null
								}]
							},
							"menuTitle": "Classroom",
							"tooltip": "Classroom",
							"createdBy": "admin",
							"dateCreated": "Thu Jul 28 2011 13:06:42 GMT-0700",
							"dateModified": "Sun Aug 21 2011 12:09:32 GMT-0700",
							"modifiedBy": "admin",
							"pageContent": null,
							"keywords": null,
							"menuDescription": null,
							"htmlContent": null
						}]
					},
					"menuTitle": "Faculty",
					"tooltip": "Faculty",
					"createdBy": "admin",
					"dateCreated": "Thu Jul 28 2011 13:06:42 GMT-0700",
					"dateModified": "Sun Aug 21 2011 12:10:35 GMT-0700",
					"modifiedBy": "admin",
					"pageContent": null,
					"keywords": null,
					"menuDescription": null,
					"htmlContent": null
				}, {
					"contentArea": "global",
					"name": null,
					"type": "menuitem",
					"path": "/content/tenant_831D8B107020BBEBE0400F0A32207789/navigation/primary/program",
					"tags": ["terms:categories/pagesection/footer","terms:categories/pagesection/global"],
					"target": "_parent",
					"shortDescription": null,
					"status": null,
					"longDescription": null,
					"uri": "https://portal.qaols.phoenix.edu/pogram.html",
					"menuItems": {},
					"menuTitle": "Program",
					"tooltip": null,
					"createdBy": "admin",
					"dateCreated": "Thu Jul 28 2011 13:06:42 GMT-0700",
					"dateModified": "Tue Jul 19 2011 09:48:04 GMT-0700",
					"modifiedBy": "admin",
					"pageContent": null,
					"keywords": null,
					"menuDescription": null,
					"htmlContent": null
				}, {
					"contentArea": "global",
					"name": null,
					"type": "menuitem",
					"path": "/content/tenant_831D8B107020BBEBE0400F0A32207789/navigation/primary/community",
					"tags": ["terms:categories/pagesection/footer","terms:categories/pagesection/global"],
					"target": null,
					"shortDescription": null,
					"status": null,
					"longDescription": null,
					"uri": "https://portal.qaols.phoenix.edu/social/",
					"menuItems": {},
					"menuTitle": null,
					"tooltip": null,
					"createdBy": "admin",
					"dateCreated": "Thu Jul 28 2011 13:06:42 GMT-0700",
					"dateModified": "Wed Jul 20 2011 14:19:13 GMT-0700",
					"modifiedBy": "admin",
					"pageContent": null,
					"keywords": null,
					"menuDescription": null,
					"htmlContent": null
				}, {
					"contentArea": "global",
					"name": null,
					"type": "menuitem",
					"path": "/content/tenant_831D8B107020BBEBE0400F0A32207789/navigation/primary/account",
					"tags": ["terms:categories/pagesection/footer","terms:categories/pagesection/global"],
					"target": "_parent",
					"shortDescription": null,
					"status": null,
					"longDescription": null,
					"uri": "https://portal.qaols.phoenix.edu/account.html",
					"menuItems": {},
					"menuTitle": "Account",
					"tooltip": null,
					"createdBy": "admin",
					"dateCreated": "Thu Jul 28 2011 13:06:42 GMT-0700",
					"dateModified": "Tue Jul 19 2011 09:48:13 GMT-0700",
					"modifiedBy": "admin",
					"pageContent": null,
					"keywords": null,
					"menuDescription": null,
					"htmlContent": null
				}]
			},
			"menuTitle": "Primary",
			"tooltip": null,
			"createdBy": "admin",
			"dateCreated": "Thu Jul 28 2011 13:06:42 GMT-0700",
			"dateModified": "Tue Jul 19 2011 09:46:01 GMT-0700",
			"modifiedBy": "admin",
			"pageContent": null,
			"keywords": null,
			"menuDescription": null,
			"htmlContent": null
		}];
	}
});

asyncTest('jpath simple object', function(){
	expect(1);
	require([jpath_url],function(jpath){
		var result;
		QUnit.start();
		result = jpath(simpleObject, '[name=test]');
		equal(result.length, 1, 'result should have 1 hit');

	});
});


asyncTest('jpath simple object (bad path)', function(){
	expect(1);
	require([jpath_url],function(jpath){
		var result;
		QUnit.start();
		result = jpath(simpleObject, '[names=test]');
		equal(result.length, 0, 'result should be empty');

	});
});

asyncTest('jpath array of complex objects - search for objects containing a simple property', function(){
	expect(1);
	require([jpath_url],function(jpath){
		var result;
		QUnit.start();
		result = jpath(arrayOfComplexObjects, 'primary');
		equal(result.length, 1, 'result should have 1 hit');
	});
});


asyncTest('jpath array of complex objects - search for objects containing a simple property equals value', function(){
	expect(1);
	require([jpath_url],function(jpath){
		var result;
		QUnit.start();
		result = jpath(arrayOfComplexObjects, '[contentArea=global]');
		equal(result.length, 3, 'result should have 3 hits');
	});
});


asyncTest('jpath array of complex objects - search for objects containing a simple property equals value (negative)', function(){
	expect(1);
	require([jpath_url], function(jpath){
		var result;
		QUnit.start();
		result = jpath(arrayOfComplexObjects, '[contentArea=globalnegative]');
		equal(result.length, 0, 'result should have 0 hits');
	});
});

asyncTest('jpath array of complex objects - search for objects containing a simple property ends with value (whole match)', function(){
	expect(1);
	require([jpath_url], function(jpath){
		var result;
		QUnit.start();
		result = jpath(arrayOfComplexObjects, '[contentArea$=global]');
		equal(result.length, 3, 'result should have 3 hits');
	});
});

asyncTest('jpath array of complex objects - search for objects containing a simple property ends with value (true partial)', function(){
	expect(1);
	require([jpath_url], function(jpath){
		var result;
		QUnit.start();
		result = jpath(arrayOfComplexObjects, '[contentArea$=al]');
		equal(result.length, 3, 'result should have 3 hits');
	});
});

asyncTest('jpath array of complex objects - search for objects containing a simple property ends with value (actually starts with)', function(){
	expect(1);
	require([jpath_url], function(jpath){
		var result;
		QUnit.start();
		result = jpath(arrayOfComplexObjects, '[contentArea$=alu]');
		equal(result.length, 0, 'result should have 0 hits');
	});
});



test('jpath array of complex objects - search for objects containing a simple property starts with value (whole match)', function(){
	expect(1);
	require([jpath_url], function(jpath){
		var result;
		QUnit.start();
		result = jpath(arrayOfComplexObjects, '[contentArea^=global]');
		equal(result.length, 3, 'result should have 3 hits');
	});
});

test('jpath array of complex objects - search for objects containing a simple property starts with value (true partial)', function(){
	expect(1);
	require([jpath_url], function(jpath){
		var result;
		QUnit.start();
		result = jpath(arrayOfComplexObjects, '[contentArea^=gl]');
		equal(result.length, 3, 'result should have 3 hits');
	});
});

test('jpath array of complex objects - search for objects containing a simple property starts with value (actually ends with)', function(){
	expect(1);
	require([jpath_url], function(jpath){
		var result;
		QUnit.start();
		result = jpath(arrayOfComplexObjects, '[contentArea^=al]');
		equal(result.length, 0, 'result should have 0 hits');
	});
});

test('jpath array of complex objects - search for objects containing a simple property contains the value (anywhere inside)', function(){
	expect(1);
	require([jpath_url], function(jpath){
		var result;
		QUnit.start();
		result = jpath(arrayOfComplexObjects, '[contentArea*=a]');
		equal(result.length, 10, 'result should have 10 hits');
	});
});

test('jpath array of complex objects - search for objects containing a multiple property value test on the same node', function(){
	expect(1);
	require([jpath_url], function(jpath){
		var result;
		QUnit.start();
		result = jpath(arrayOfComplexObjects, '[contentArea*=a][contentArea^=gl]');
		equal(result.length, 3, 'result should have 3 hits');
	});
});

test('jpath array of complex objects - search for objects containing a multiple property value test on the same node - should include null values for prop only side test', function(){
	expect(1);
	require([jpath_url], function(jpath){
		var result;
		QUnit.start();
		result = jpath(arrayOfComplexObjects, '[contentArea*=a][menuTitle]');
		equal(result.length, 10, 'result should have 10 hits');
	});
});