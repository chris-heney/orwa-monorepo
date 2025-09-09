/**
 * wp-grant-applications service
 */

export default ({strapi}) => ( {
    createGrantApplication: async (ctx) => {

        let contactId = 0;
        let chairmanId = 0;
        let engineerId = 0;
    
        //return an id of the status
        const getStatus = async (status: string) => {
          try {
            const fetchedStatus = await strapi.documents('api::grant-status.grant-status').findMany({
              filters: {
                name: status
              }
            })
            return fetchedStatus[0].id as number;
          } catch (error) {
            console.error('Error:', error);
          }
        }
    
        // for change order request set old application to change order set the new application to status revised 
        const findApplicationAndSetToChangeOrder = async (applicationId: string) => {
    
          if (ctx.request.body.data.change_order_request === 'No') return null;
          console.log('setting application to change order', applicationId)
          const statusId = await getStatus('Revised per COR')
    
          try {
            const fetchedApplication = await strapi.documents('api::grant-application-final.grant-application-final').findMany({
              filters: {
                application_id: applicationId
              }
            })
    
            // set the application to change order
    
            await strapi.documents('api::grant-application-final.grant-application-final').update({
              documentId: "__TODO__",

              data: {
                status: statusId
              }
            })
    
            return fetchedApplication[0].application_id;
    
          } catch (error) {
            console.error('Error:', error);
          }
        }
    
    
        const checkForContact = async (email: string): Promise<{ success: boolean; data?: any; error?: any }> => {
          console.log('email', email)
          try {
    
            const fetchedContact = await strapi.documents('api::contact.contact').findMany({
              filters: {
                email: email
              }
            })
            // Assuming the API returns the contact object in the `data` property
    
            return { success: true, data: fetchedContact, error: null };
          } catch (error) {
            console.error('Error:', error);
            return { success: false, data: null, error };
          }
        }
    
    
        const createOrUpdateContact = async (first: string, last: string, email: string, entity: string) => {
          try {
            // Assuming checkForContact returns an object with success, data, and error properties
            const { data: contactCheckResult, success } = await checkForContact(email);
            console.log('success', success)
            console.log('contactCheckResult', contactCheckResult)
            if (success && contactCheckResult.length > 0) {
              // Contact found, grab its ID
    
              console.log('Contact found:', contactCheckResult[0].id);
    
              if (entity === 'contact') contactId = contactCheckResult[0].id
              else if (entity === 'engineer') engineerId = contactCheckResult[0].id
    
              console.log('Contact found, ID:', contactId);
              console.log('Engineer found, ID:', engineerId);
    
    
              const payload = {
                documentId: "__TODO__",
                "id": entity === 'contact' ? contactId : engineerId,

                data: {
                  "first": first,
                  "last": last,
                  "phone": entity === 'contact' ? ctx.request.body.data.contact_phone : ctx.request.body.data.engineer_phone,
                  "title": entity === 'contact' ? ctx.request.body.data.contact_title : 'Engineer',
                  "badges": entity === 'contact' ? [20] : [21]
                }
              }
    
              await strapi.documents('api::contact.contact').update(payload)
    
              // Perform any additional actions with the existing contact if needed
            } else {
              // Contact not found, create a new one
              const contactData = {
                data: {
                  "first": first,
                  "last": last,
                  "email": email,
                  "phone": entity === 'contact' ? ctx.request.body.data.contact_phone : ctx.request.body.data.engineer_phone,
                  "title": entity === 'contact' ? ctx.request.body.data.contact_title : 'Engineer',
                  "badges": entity === 'contact' ? [20] : [21]
                }
              };
    
              console.log('New contact data:', contactData);
    
              try {
    
                const createResult = await strapi.documents('api::contact.contact').create(contactData)
    
                if (entity === 'contact') contactId = createResult.id as number
                else if (entity === 'engineer') engineerId = createResult.id as number;
    
                console.log('Contact created, ID:', contactId);
    
                // Perform any additional actions after creating the contact if needed
              } catch (error: any) {
                console.error('Error creating contact:', error);
              }
            }
          } catch (error: any) {
            console.error('Error checking for contact:', error);
          }
        };
    
        function formatDate(initialDate) {
          const dateObject = new Date(initialDate);
    
          const year = dateObject.getFullYear();
          const month = String(dateObject.getMonth() + 1).padStart(2, '0');
          const day = String(dateObject.getDate()).padStart(2, '0');
    
          return `${year}-${month}-${day}`;
        }
    
        const formattedApplicationDate = formatDate(ctx.request.body.data.application_date)
        const formattedCommitteeDate = formatDate(ctx.request.body.data.committee_date)
        console.log('formatted Application Date', formatDate(ctx.request.body.data.application_date))
        try {
          console.log('Received data:', ctx.request.body);
    
    
          // create contact
          if ((ctx.request.body.data.contact_first && ctx.request.body.data.contact_last)) {
            try {
    
              createOrUpdateContact(ctx.request.body.data.contact_first, ctx.request.body.data.contact_last, ctx.request.body.data.contact_email, 'contact')
    
            } catch (error) {
              console.log('Error in creating contact:', error.message);
              console.log('Error in creating contact:', error.details);
            }
          }
          // chairman contact
          if (ctx.request.body.data.chairman_first && ctx.request.body.data.chairman_last) {
            try {
              const chairman = await strapi.documents('api::contact.contact').create({
                data: {
                  "first": ctx.request.body.data.chairman_first,
                  "last": ctx.request.body.data.chairman_last,
                  "badges": [19]
                }
              })
              console.log('Chairman created:', chairman);
              chairmanId = chairman.id as number;
            } catch (error) {
              console.log('Error in creating contact:', error.message);
              console.log('Error in creating contact:', error.details);
            }
          }
          // engineer contact
          if (ctx.request.body.data.engineer_first && ctx.request.body.data.engineer_last) {
            try {
              createOrUpdateContact(ctx.request.body.data.contact_first, ctx.request.body.data.contact_last, ctx.request.body.data.contact_email, 'contact')
            } catch (error) {
              console.log('Error in creating contact:', error.message);
              console.log('Error in creating contact:', error.details);
            }
          }
    
    
          const tocapitalize = (str: string) => {
            return str.replace(/\b\w/g, (l) => l.toUpperCase());
          }
    
          const getProjectIds = async (projects: string[], classification: 'Drinking Water' | 'Wastewater') => {
            const projectIds = []
            for (let project of projects) {
              console.log('project', project)
              project = tocapitalize(project)
    
              if (project === 'Custom Meters') {
                project = 'Customer Meters'
              }
              if (project === 'Master/Inline Meters') {
                project = 'Master / Inline Meters'
              }
              try {
    
                const projectData = await strapi.documents('api::project-type.project-type').findMany({
                  filters: {
                    name: project,
                    classification: classification
                  }
                })
                console.log('projectData', projectData)
    
                if (projectData && projectData.length > 0) {
                  projectIds.push(projectData[0].id)
                }
              } catch (error) {
                console.error('Error:', error);
              }
    
            }
            return projectIds
          }
    
          let drinkingWaterProjectIds = []
          let wastewaterProjectIds = []
          let projectsApprovedIds = []
    
          if (ctx.request.body.data.drinking_water_projects_selected) {
            const drinkingWaterProjects = ctx.request.body.data.drinking_water_projects_selected.split(',').map((project) => project.trim())
            const projectIds  = await getProjectIds(drinkingWaterProjects, 'Drinking Water')
            drinkingWaterProjectIds = projectIds
          }
    
          if (ctx.request.body.data.wastewater_projects_selected) {
            const wastewaterProjects = ctx.request.body.data.wastewater_projects_selected.split(',').map((project) => project.trim())
            const projectIds  = await getProjectIds(wastewaterProjects, 'Wastewater')
            wastewaterProjectIds = projectIds
          }
    
          if (ctx.request.body.data.projects_approved) {
            const projectsApproved = ctx.request.body.data.projects_approved.split(',').map((project) => project.trim())
            const projectIds = await getProjectIds(projectsApproved, ctx.request.body.data.drinking_or_wastewater)
            projectsApprovedIds = projectIds
          }
    
          const statusId = await getStatus('New Application')
    
          // const applicationId = await findApplicationAndSetToChangeOrder(ctx.request.body.data.application_id)
    
          // const ctx.request.body.data.projects_approved,
          // const      ctx.request.body.data.drinking_water_projects_selected,  ctx.request.body.data.wastewater_projects_selected,    
    
          //   "drinking_water_projects_selected": ctx.request.body.data.drinking_water_projects_selected,
          // "wastewater_projects_selected": ctx.request.body.data.wastewater_projects_selected,
          function extractWholeNumber(input: string): number {
            // Remove all non-numeric characters
            const numericString = input.replace(/\D/g, '');
            
            // Convert the resulting string to a number
            const result = parseInt(numericString, 10);
          
            // Ensure a whole number is returned
            return isNaN(result) ? 0 : result;
          }

          console.log(ctx.request.body.data)

          try {
            await strapi.documents('api::grant-application-final.grant-application-final').create({
              data: {
                "legal_entity_name": ctx.request.body.data.legal_entity_name,
                "facility_id": ctx.request.body.data.facility_id,
                // make sure this is always a number
                "population_served": extractWholeNumber(ctx.request.body.data.population_served),
                "county": ctx.request.body.data.county,
                "physical_address_street": ctx.request.body.data.physical_address_street,
                "physical_address_line_two": ctx.request.body.data.physical_address_line_two,
                "physical_address_city": ctx.request.body.data.physical_address_city,
                "physical_address_state": ctx.request.body.data.physical_address_state,
                "physical_address_zip": ctx.request.body.data.physical_address_zip,
                "physical_same_as_mailing": ctx.request.body.data.physical_same_as_mailing === 'No' ? false : true,
                "mailing_address_street": ctx.request.body.data.mailing_address_street,
                "mailing_address_line_two": ctx.request.body.data.mailing_address_line_two,
                "mailing_address_city": ctx.request.body.data.mailing_address_city,
                "mailing_address_state": ctx.request.body.data.mailing_address_state,
                "mailing_address_zip": ctx.request.body.data.mailing_address_zip,
                "point_of_contact": contactId !== 0 ? contactId : null,
                "chairman": chairmanId !== 0 ? chairmanId : null,
                "chairman_also_mayer_of_municipal_city": ctx.request.body.data.chairman_also_mayer_of_municipal_city,
                "has_engineer": ctx.request.body.data.has_engineer === 'No' ? false : true,
                "engineer": engineerId !== 0 ? engineerId : null,
                "drinking_or_wastewater": ctx.request.body.data.drinking_or_wastewater,
                "drinking_water_projects_selected": ctx.request.body.data.drinking_water_projects_selected,
                "wastewater_projects_selected": ctx.request.body.data.wastewater_projects_selected,
                "other_describe": ctx.request.body.data.other_describe,
                "description_justification_estimated_cost": ctx.request.body.data.description_justification_estimated_cost,
                "project_proposal_birds": ctx.request.body.data.project_proposal_birds,
                "combined_cost_of_projects": ctx.request.body.data.combined_cost_of_projects,
                "requested_grant_amount": ctx.request.body.data.requested_grant_amount,
                "portion_matched_by_recipient": ctx.request.body.data.portion_matched_by_recipient,
                "minimum_utility_financial_contribution": ctx.request.body.data.minimum_utility_financial_contribution,
                "engineering_report": ctx.request.body.data.engineering_report,
                "upload_engineering_report": ctx.request.body.data.upload_engineering_report,
                "report_approved_by_deq": ctx.request.body.data.report_approved_by_deq,
                "resolves_violation": ctx.request.body.data.resolves_violation,
                "notice_of_violation": ctx.request.body.data.notice_of_violation,
                "signatory_name": ctx.request.body.data.signatory_name,
                "signatory_title": ctx.request.body.data.signatory_title,
                "signature": ctx.request.body.data.signature,
                "application_status": ctx.request.body.data.application_status,
                "approved_project_cost": ctx.request.body.data.approved_project_cost !== "" ? ctx.request.body.data.approved_project_cost : null,
                "award_amount": ctx.request.body.data.award_amount !== "" ? ctx.request.body.data.award_amount : null,
                "expected_utility_match": ctx.request.body.data.expected_utility_match,
                "projects_approved": ctx.request.body.data.projects_approved,
                "remaining_grant_funds": ctx.request.body.data.remaining_grant_funds,
                "other_needs": ctx.request.body.data.other_needs,
                "additional_files": ctx.request.body.data.additional_files,
                "change_order_request": ctx.request.body.data.change_order_request,
                "deq_action": ctx.request.body.data.deq_action,
                // rural infrastructure grant
                "grant": 4,
                // "committee_date": formattedCommitteeDate,
                // "application_date": formattedApplicationDate,
                // new application status   
                "classification": ctx.request.body.data.drinking_or_wastewater,
                "status": statusId,
                "application_id": ctx.request.body.data.application_id,
                "email": ctx.request.body.data.email,
                "approved_projects": projectsApprovedIds,
                "selected_projects": drinkingWaterProjectIds ? drinkingWaterProjectIds : wastewaterProjectIds,
                "application_date": new Date()
              },
            })
          } catch (error) {
            console.log('Error in creating grant application:', error.message);
            console.log('Error in creating grant application:', error.details);
    
          }
        } catch (err) {
          console.error('Error:', err);
          ctx.body = err;
        }
      }
});
