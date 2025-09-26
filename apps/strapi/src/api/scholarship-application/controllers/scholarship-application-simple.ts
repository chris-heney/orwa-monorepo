/**
 * Simple scholarship-application controller for testing
 */

export default ({ strapi }) => {
  return {
    createScholarshipApplication: async (ctx) => {
      try {
        console.log('📥 Received scholarship application payload:', JSON.stringify(ctx.request.body, null, 2));

        const payload = ctx.request.body;

        // Simple data mapping without complex contact logic for testing
        const data = {
          // Note: contact relationship will be null for now - can be added later
          contact: null,
          watersystem: payload.watersystem_id || null,
          relationship: payload.relationship,
          eligible_participant: payload.eligible_participant_id || null,
          eligible_participant_title: payload.eligible_participant_title,
          
          // Academic Data
          school_name: payload.school_name,
          graduation_date: payload.graduation_date,
          school_street: payload.school_street,
          school_city: payload.school_city,
          school_state: payload.school_state,
          school_zip: payload.school_zip,
          high_school_gpa: payload.high_school_gpa,
          sat_score: payload.sat_score,
          act_score: payload.act_score,
          transcript: payload.transcript,
          test_scores: payload.test_scores,

          // College Data
          first_year_higher_education: payload.first_year_higher_education,
          credits_completed: payload.credits_completed,
          credits_required: payload.credits_required,
          college_gpa: payload.college_gpa,
          education_type: payload.education_type,
          major: payload.major,

          // Additional Info
          awards_recognition: payload.awards_recognition,

          // Recommendations
          recommender1_first_name: payload.recommender1_first_name,
          recommender1_last_name: payload.recommender1_last_name,
          recommender1_email: payload.recommender1_email,
          recommender1_phone: payload.recommender1_phone,
          recommendation_letter_1: payload.recommendation_letter_1,
          recommender2_first_name: payload.recommender2_first_name,
          recommender2_last_name: payload.recommender2_last_name,
          recommender2_email: payload.recommender2_email,
          recommender2_phone: payload.recommender2_phone,
          recommendation_letter_2: payload.recommendation_letter_2,

          // Financial Aid
          financial_aid_1_institution: payload.financial_aid_1_institution,
          financial_aid_1_amount: payload.financial_aid_1_amount,
          financial_aid_2_institution: payload.financial_aid_2_institution,
          financial_aid_2_amount: payload.financial_aid_2_amount,

          // Uploads
          essay: payload.essay,
          biography: payload.biography,
          photograph: payload.photograph,

          // Certification
          age_18_or_older: payload.age_18_or_older,
          applicant_certification: payload.applicant_certification,
          applicant_certification_date: payload.applicant_certification_date,
          guardian_first_name: payload.guardian_first_name,
          guardian_last_name: payload.guardian_last_name,
          guardian_certification: payload.guardian_certification,
          guardian_certification_date: payload.guardian_certification_date,

          // Application Management
          application_status: "Submitted",
          submission_date: new Date(),
        };

        console.log('💾 Creating scholarship application with data:', JSON.stringify(data, null, 2));

        const scholarshipApplication = await strapi.documents("api::scholarship-application.scholarship-application").create({
          data: data,
        });

        console.log('✅ Scholarship application created successfully:', scholarshipApplication.documentId);

        ctx.status = 200;
        ctx.body = {
          message: "success",
          scholarshipApplication,
        };

      } catch (err) {
        console.error("❌ Scholarship Application Error:", err.message);
        console.error("❌ Full Error:", err);
        ctx.status = 500;
        ctx.body = {
          message: "error",
          error: err.message,
          details: err.stack
        };
      }
    },
  };
};


