// Default test data for organization onboarding
export const defaultValues = {
  // "name": "Tech Innovations LLC",
  "description": "A leading provider of cutting-edge tech solutions",
  "phone": "+1234567890",
  "email": "contact@techinnovations.com",
  "icon": "https://example.com/icon.png",
  "logo": "https://example.com/logo.png",
  "organizationType": "Customer",
  "domains": [
    // {
    //   "domain": "techinnovations.com",
    //   "url": "https://www.techinnovations.com",
    //   "cnameRecords": ["cname1.example.com"],
    //   "txtRecords": ["v=spf1 include:_spf.google.com ~all"],
    //   "aRecords": ["192.168.1.1"],
    //   "mxRecords": ["mail.techinnovations.com"],
    //   "nsRecords": ["ns1.example.com", "ns2.example.com"]
    // }
  ],
  "hostingProvider": "Bluehost",
  "domain": "techinnovations.com",
  "organizationLocations": [
    {
      "address": "123 Tech Street, Silicon Valley, CA",
      "city": {
        "name": "San Francisco",
        "state": "CA",
        "latitude": 37.7749,
        "longitude": -122.4194
      },
      "latitude": 37.7749,
      "longitude": -122.4194,
      "services": [
        {
          "name": "Web Development",
          "description": "Custom web solutions for businesses."
        },
        {
          "name": "SEO Optimization",
          "description": "Improving your website's visibility."
        }
      ],
      "trades": [
        {
          "name": "IT Consulting",
          "description": "Providing expert IT consulting services."
        }
      ]
    }
  ],
  "organizationContact": [
    {
      "title": "CEO",
      "contact": {
        "first": "John",
        "last": "Doe",
        "email": "john.doe@techinnovations.com",
        "phone": "+1234567890",
        "address": "123 Tech Street, Silicon Valley, CA"
      },
      "contactType": "EMPLOYEE"
    }
  ],
  "brand": {
    "hasBrandStyleGuide": true,
    "brandColors": ["#FF5733", "#C70039", "#900C3F"],
    "preferredFonts": "Arial, Helvetica, sans-serif",
    "logoFiles": ["https://example.com/logo1.png", "https://example.com/logo2.png"]
  },
  "social": {
    "socialMediaPresence": {
      "facebook": "https://facebook.com/techinnovations",
      "twitter": "https://twitter.com/tech_innovations",
      "linkedin": "https://linkedin.com/company/techinnovations"
    },
    "hasSocialMediaStrategy": true,
    "postingFrequency": "3 times a week"
  },
  "paidAdvertising": {
    "currentAdCampaigns": true,
    "adPlatforms": ["Google Ads", "Facebook Ads"],
    "monthlyAdSpend": 5000,
    "adPrimaryGoals": "Lead generation, brand awareness"
  },
  "analytics": {
    "googleAnalyticsAccount": "UA-12345678-9",
    "tagManagerAccount": "GTM-ABC1234",
    "mccPaidAdsAccount": "12345-67890",
    "whatConvertsCallTracking": true,
    "heatmapTrackingSystem": "Hotjar",
    "conversionTrackingGoals": ["Lead Submission", "Product Purchase"]
  },
  "content": {
    "contentNeeded": "New",
    "toneStylePreferences": "Professional, but approachable",
    "topCustomerQuestions": ["How can we improve your business?", "What services do you need the most?"]
  },
  "seo": {
    "primaryServices": "Web Development, SEO Optimization",
    "targetCities": ["New York", "San Francisco", "Los Angeles"],
    "competitorSeoAnalysis": "competitor1.com: Good SEO, competitor2.com: Needs Improvement",
    "targetKeywords": ["tech solutions", "IT services", "business technology"]
  },
  "projectDetails": {
    "websiteType": "Redesign",
    "websiteIssues": "Slow load times, outdated design",
    "preferredWebsiteStyle": "Modern and minimalist",
    "sitemapStatus": "Completed",
    "domainRegistrar": "GoDaddy",
    "contentManagementSystem": "WordPress",
    "needWebsiteMaintenancePlan": true,
    "legalComplianceRequirements": "GDPR, CCPA",
    "requiredRedirects": "http://oldtech.com -> https://www.techinnovations.com",
    "legalBusinessName": "Tech Innovations LLC",
    "primaryContactName": "John Doe",
    "primaryContactEmail": "john.doe@techinnovations.com",
    "primaryContactPhone": "+1234567890",
    "businessOwnerName": "Jane Smith",
    "businessOwnerContact": "+1234567890",
    "companyAddress": "123 Tech Street, Silicon Valley, CA",
    "businessLicense": "LIC123456",
    "certifications": "TEST",
    "yearsInBusiness": 10,
    "businessHours": "9 AM - 5 PM, Monday to Friday",
    "missionAndValues": "Deliver cutting-edge technology solutions with integrity.",
    "elevatorPitch": "Innovative tech solutions that help businesses thrive.",
    "usp": "Tech solutions that are ahead of the curve.",
    "companyTagline": "Empowering your business with technology.",
    "companyHistory": "Founded in 2012, we've been serving clients worldwide.",
    "marketingPainPoints": "Low brand recognition in new markets.",
    "currentWebsiteUrl": "https://www.techinnovations.com"
  }
}; 