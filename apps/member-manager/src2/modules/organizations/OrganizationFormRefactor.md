# Organization Form Refactor Guide

## Overview
This document outlines the comprehensive changes needed to update the Synapse organization forms to match the current Organization.prisma schema and align with the onboard app implementation. The schema has undergone significant changes with new fields, flattened relationships, and enhanced Cortex AI configuration.

## Major Schema Changes

### 1. New Budget Allocation Fields
The Organization model now includes detailed budget allocation fields (stored in cents):
- `budgetSeoAiSearch` (Int, default: 0)
- `budgetAiConversionTools` (Int, default: 0)
- `budgetLocalMarketing` (Int, default: 0)
- `budgetPaidAdvertising` (Int, default: 0)
- `budgetLsa` (Int, default: 0)
- `budgetSocialMediaOrganic` (Int, default: 0)
- `budgetSocialMediaAds` (Int, default: 0)
- `budgetAggregatorDirectory` (Int, default: 0)
- `budgetTraditionalOther` (Int, default: 0)

### 2. New Business Information Fields
- `currentWebsiteUrl` (String?)
- `leadNotificationPhone` (String?)
- `leadNotificationEmail` (String?)
- `websiteTemplateId` (Int?)
- `websiteTemplateLink` (String?)
- `onboardSavedStoreState` (Json?)
- `dealerInterests` (String[])

### 3. Enhanced Cortex AI Configuration
New comprehensive AI configuration fields:
- `companyStrategy` (String? @db.Text)
- `customerAvatar` (String? @db.Text)
- `descriptionShort` (String? @db.Text)
- `publishContentMode` (PublishMode, default: AUTO)
- `localSeoEnabled` (Boolean, default: false)
- `localSeoLocations` (String[], default: [])
- `customerArticleReviewMode` (ReviewMode, default: COMMENTS_ONLY)
- `authorNameAndTitle` (String?)
- `mentionAuthorInArticles` (Boolean, default: true)
- `authorOverride` (String?)
- `internalLinkTargets` (String[], default: [])

### 4. New Image Configuration Fields
- `imageCustomUploaded` (Int, default: 0)
- `imageCustomInfographics` (Boolean, default: true)
- `imageStockEnabled` (Boolean, default: true)
- `aiImagesEnabled` (Boolean, default: false)
- `imageQuantity` (ImageQuantity, default: AI_DECIDE)
- `imageLogoInclusion` (LogoInclusion, default: SELECTED)
- `infographicsAccuracySetting` (InfographicsAccuracy, default: PRIORITIZE_VARIETY)
- `customImageInstructions` (String? @db.Text)

### 5. New Article Configuration Fields
- `articleLengthMode` (ArticleLengthMode, default: SMART)
- `automatedBlogPosting` (Boolean, default: false)

### 6. New Backlink & PR Configuration
- `backlinkBuildingEnabled` (Boolean, default: true)
- `prOutreachTopics` (String[], default: [])

### 7. Comprehensive Author Profile Fields
- `authorFullName` (String?)
- `authorPreferredName` (String?)
- `authorEmail` (String?)
- `authorLinkedinProfile` (String?)
- `authorShortBio` (String? @db.Text)
- `authorTradeInspiration` (String? @db.Text)
- `authorWorkPassion` (String? @db.Text)
- `authorCertifications` (String? @db.Text)
- `authorExpertTopics` (String? @db.Text)
- `authorIndustryMyth` (String? @db.Text)
- `authorFunFact` (String? @db.Text)
- `authorCommunityWork` (String? @db.Text)
- `authorMediaFeatures` (Boolean, default: false)
- `authorPersonalStory` (String? @db.Text)
- `authorAvoidTopics` (String? @db.Text)
- `authorMediaPermission` (Boolean, default: false)

### 8. Enhanced Google Business Profile Fields
- `accessGbp` (Boolean, default: false)
- `publishNewPosts` (Boolean, default: true)
- `postFrequency` (String?, default: "weekly")
- `imageSource` (ImageSource, default: AI_GENERATED)
- `brandImages` (Boolean, default: true)
- `callToActions` (String[], default: [])
- `approvals` (ApprovalMode, default: NO)
- `minimumRating` (Int, default: 3)
- `publishReviews` (Boolean, default: true)

### 9. New Review Management Fields
- `reviewResponseAutomated` (Boolean, default: true)
- `reviewResponseAutomaticMinRating` (Int, default: 3)
- `reviewResponseAutomaticApproval` (Boolean, default: false)

## Form Structure Changes

### Current Synapse Tabs (Need Updates)
1. **Basic Details** - ✅ Keep, add new fields
2. **Locations** - ✅ Keep
3. **Contacts** - ✅ Keep
4. **Analytics** - ✅ Keep
5. **Brand** - ✅ Keep, enhance with new OrganizationBrand fields
6. **Content** - ✅ Keep
7. **Paid Advertising** - ✅ Keep, add budget allocation fields
8. **SEO** - ✅ Keep
9. **Social** - ✅ Keep, enhance with new GBP fields
10. **Project Details** - ✅ Keep
11. **Domains** - ✅ Keep
12. **Trade Services** - ✅ Keep
13. **Service Contracts** - ✅ Keep
14. **Tech Stacks** - ✅ Keep
15. **Cortex AI** - ✅ Keep, major expansion needed

### New Tabs Needed
1. **Budget Allocation** - NEW tab for detailed budget breakdown
2. **Cortex Local** - NEW tab for Google Business Profile automation
3. **Cortex Pulse** - NEW tab for PR & media outreach configuration
4. **Review Management** - NEW tab for review automation settings
5. **Promotions** - NEW tab for year-round promotions management
6. **Franchise/PE Questions** - NEW tab for ownership-specific questions

## Detailed Form Updates

### 1. Basic Details Tab Updates
**File**: `form-sections/basic-details/BasicDetailsTab.tsx`

**Add Fields**:
- `currentWebsiteUrl` - Website URL input
- `leadNotificationPhone` - Phone input for lead notifications
- `leadNotificationEmail` - Email input for lead notifications
- `websiteTemplateId` - Dropdown for website template selection
- `websiteTemplateLink` - URL input for template link
- `dealerInterests` - Multi-select for dealer interests

### 2. New Cortex Local Tab
**Create**: `form-sections/cortex-local/CortexLocalTab.tsx`

**Fields to Include**:
- **Posting Configuration**:
  - `postFrequency` - Dropdown (daily, weekly)
  - `publishNewPosts` - Boolean toggle for auto-posting

- **Review Settings**:
  - `publishReviews` - Boolean toggle for publishing reviews as posts
  - `minimumRating` - Rating component (1-5 stars) for auto-approval threshold

**Reference**: Use `apps/onboard/src/components/steps/StepCortexLocal.tsx` as implementation guide

### 3. New Cortex Pulse Tab
**Create**: `form-sections/cortex-pulse/CortexPulseTab.tsx`

**Fields to Include**:
- **Backlink Building Strategy**:
  - `backlinkBuildingEnabled` - Boolean toggle
  - `prOutreachTopics` - Multi-select for PR topics

- **Basic Information** (when backlink enabled):
  - `authorFullName` - Text input (required)
  - `authorPreferredName` - Text input
  - `authorEmail` - Email input (required)
  - `authorLinkedinProfile` - URL input with LinkedIn validation
  - Author headshot upload (using FileUploadField with assetType 'headshot')

- **Professional Background**:
  - `authorShortBio` - Text area (300 char limit)
  - `authorTradeInspiration` - Text area (500 char limit)
  - `authorWorkPassion` - Text area (500 char limit)
  - `authorCertifications` - Text area (500 char limit)

- **Expertise & Industry Knowledge**:
  - `authorExpertTopics` - Text area (500 char limit)
  - `authorIndustryMyth` - Text area (500 char limit)
  - `authorFunFact` - Text area (300 char limit)

- **Media & Community**:
  - `authorCommunityWork` - Text area (500 char limit)
  - `authorMediaFeatures` - Boolean toggle
  - `authorPersonalStory` - Text area (500 char limit)
  - `authorAvoidTopics` - Text area (300 char limit)
  - `authorMediaPermission` - Boolean toggle (required)

**Reference**: Use `apps/onboard/src/components/steps/StepCortexPulse.tsx` as implementation guide

### 4. Enhanced Brand Tab
**File**: `form-sections/brand/BrandTab.tsx`

**Add OrganizationBrand Fields**:
- Brand Overview section (brandName, tagline, mission, vision, coreValues)
- Logo Guidelines section (primaryLogoUsage, secondaryLogoUsage, logoVariations, etc.)
- Color Palette section (primaryColors, secondaryColors, colorUsageGuidelines)
- Typography section (primaryFontName, secondaryFontName, typographyGuidelines)
- Iconography section (primaryIcons, secondaryIcons, iconographyGuidelines)
- Imagery Guidelines section (photographyStyle, imageFilters, stockImageUsage)
- Voice and Tone section (brandVoice, marketingTone, technicalTone, etc.)

**Reference**: Use `apps/onboard/src/components/steps/StepBranding.tsx` as implementation guide

### 5. Enhanced Paid Advertising Tab
**File**: `form-sections/advertising/PaidAdvertisingTab.tsx`

**Add Budget Fields**:
- `budgetPaidAdvertising` - Monthly budget input
- `budgetSocialMediaAds` - Social media advertising budget
- `budgetLsa` - Local Service Ads budget

### 6. Enhanced Social Tab
**File**: `form-sections/social/SocialTab.tsx`

**Add New GBP Fields**:
- `accessGbp` - Boolean for GBP access
- `publishNewPosts` - Boolean for publishing new posts
- `postFrequency` - Dropdown for posting frequency
- `imageSource` - Dropdown for image source preference
- `brandImages` - Boolean for brand image usage
- `callToActions` - Multi-select for call-to-action options
- `approvals` - Dropdown for approval mode
- `minimumRating` - Number input for minimum rating
- `publishReviews` - Boolean for review publishing

### 7. Major Cortex AI Tab Expansion
**File**: `form-sections/cortex/CortexTab.tsx`

**Add New Sections**:

#### Company Strategy & Positioning
- `companyStrategy` - Large text area for AI-generated strategy
- `customerAvatar` - Large text area for customer persona
- `descriptionShort` - Text area for short description

#### SEO Configuration
- `publishContentMode` - Radio buttons (AUTO/MANUAL)
- `localSeoEnabled` - Boolean toggle
- `localSeoLocations` - Multi-select for locations

#### Content Review & Approval
- `customerArticleReviewMode` - Radio buttons (COMMENTS_ONLY/APPROVAL_REQUIRED)

#### Author Configuration
- `authorNameAndTitle` - Text input
- `mentionAuthorInArticles` - Boolean toggle
- `authorOverride` - Text input

#### Link Management
- `internalLinkTargets` - Multi-select for target URLs

#### Image Configuration
- `imageCustomUploaded` - Number input
- `imageCustomInfographics` - Boolean toggle
- `imageStockEnabled` - Boolean toggle
- `aiImagesEnabled` - Boolean toggle
- `imageQuantity` - Dropdown (AI_DECIDE/ONE/TWO/THREE/CUSTOM)
- `imageLogoInclusion` - Radio buttons (NONE/SELECTED/ALL)
- `infographicsAccuracySetting` - Radio buttons (PRIORITIZE_VARIETY/PRIORITIZE_ACCURACY)
- `customImageInstructions` - Large text area

#### Article Configuration
- `articleLengthMode` - Radio buttons (SMART/MANUAL)
- `automatedBlogPosting` - Boolean toggle

#### Backlink & PR Configuration
- `backlinkBuildingEnabled` - Boolean toggle
- `prOutreachTopics` - Multi-select for topics

### 8. New Review Management Tab
**Create**: `form-sections/review-management/ReviewManagementTab.tsx`

**Fields to Include**:
- **Automation Settings**:
  - `reviewResponseAutomated` - Boolean toggle
  - `reviewResponseAutomaticMinRating` - Number input (1-5)
  - `reviewResponseAutomaticApproval` - Boolean toggle

- **Review Publishing**:
  - `publishReviews` - Boolean toggle
  - `minimumRating` - Number input for minimum rating threshold

### 9. New Promotions Tab
**Create**: `form-sections/promotions/PromotionsTab.tsx`

**Fields to Include**:
- **Promotion Details**:
  - `promotions[0].promotionType` - Dropdown (SEASONAL_OFFER, MAINTENANCE_SPECIAL, FINANCING_OFFER, etc.)
  - `promotions[0].promotionTitle` - Text input
  - `promotions[0].promotionDescription` - Text area
  - `promotions[0].discountAmount` - Number input
  - `promotions[0].discountType` - Dropdown (PERCENTAGE, FIXED_AMOUNT)
  - `promotions[0].isYearRoundOffer` - Boolean toggle
  - `promotions[0].startDate` - Date input (conditional)
  - `promotions[0].endDate` - Date input (conditional)

- **Targeting**:
  - `promotions[0].validFor` - Multi-select (NEW_CUSTOMERS, EXISTING_CUSTOMERS, etc.)
  - `promotions[0].serviceCategories` - Multi-select (HEATING, COOLING, etc.)
  - `promotions[0].seasonalTag` - Dropdown (SPRING, SUMMER, FALL, WINTER, YEAR_ROUND)

- **Company Contact**:
  - `promotions[0].submittedBy` - Text input
  - `promotions[0].submitterContactEmail` - Email input
  - `promotions[0].branchLocation` - Text input

**Reference**: Use `apps/onboard/src/components/steps/StepYearRoundPromotions.tsx` as implementation guide

### 10. New Franchise/PE Questions Tab
**Create**: `form-sections/ownership-questions/OwnershipQuestionsTab.tsx`

**Fields to Include**:

#### Franchise Section (when ownershipType = FRANCHISE):
- **Franchise Information**:
  - `organizationFranchise.networkScope` - Number input (number of locations)
  - `organizationFranchise.ownedLocations` - Number input
  - `organizationFranchise.systemType` - Dropdown (Corporate-owned, Franchisee-owned, Hybrid)
  - `organizationFranchise.marketingDecision` - Dropdown (Corporate, Franchisee, Shared responsibility)

- **Brand Guidelines**:
  - `organizationFranchise.brandGuidelines` - Dropdown (Yes/No)
  - `organizationFranchise.brandGuidelinesLink` - URL input (conditional)

- **Marketing Needs**:
  - `organizationFranchise.marketingNeeds` - Multi-select cards
  - `organizationFranchise.servicesInterested` - Multi-select chips

#### Private Equity Section (when ownershipType = PRIVATE_EQUITY):
- **PE Information**:
  - `organizationPrivateEquity.firmName` - Text input
  - `organizationPrivateEquity.portfolioCount` - Number input
  - `organizationPrivateEquity.ownershipRole` - Dropdown

- **Services & Goals**:
  - `organizationPrivateEquity.servicesFor` - Multi-select cards
  - `organizationPrivateEquity.growthGoals` - Multi-select cards
  - `organizationPrivateEquity.integrationNeeds` - Multi-select cards

**Reference**: Use `apps/onboard/src/components/steps/StepFranchiseQuestions.tsx` and `StepPrivateEquityQuestions.tsx` as implementation guides

## Implementation Priority

### Phase 1: Critical Updates (Week 1)
1. Update Basic Details tab with new fields
2. Add budget allocation fields to existing tabs
3. Update FileUploadField usage

### Phase 2: New Tabs (Week 2)
1. Create Cortex Local tab
2. Create Cortex Pulse tab
3. Create Review Management tab
4. Create Promotions tab
5. Create Franchise/PE Questions tab

### Phase 3: Enhanced Tabs (Week 3)
1. Expand Brand tab with OrganizationBrand fields
2. Enhance Social tab with new GBP fields
3. Major Cortex AI tab expansion

### Phase 4: Polish & Testing (Week 4)
1. UI/UX improvements
2. Form validation updates
3. Integration testing

## Technical Considerations

### 1. Form Validation
- Update validation rules for new fields
- Add proper enum validation for new dropdown fields
- Implement budget allocation validation (total should not exceed revenue)

### 2. Data Transformation
- Update form submission logic to handle new fields
- Ensure proper data type conversion (cents for budget fields)
- Handle JSON fields properly (arrays, objects)

### 3. UI Components
- Reuse components from onboard app where possible
- Maintain consistent styling with existing Synapse forms
- Ensure responsive design for all new fields

### 4. Default Values
- Set proper default values for all new fields
- Ensure enum fields have correct default selections
- Handle nullable fields appropriately

## File Structure Changes

### New Files to Create
```
form-sections/
├── cortex-local/
│   ├── CortexLocalTab.tsx
│   ├── components/
│   │   ├── PostingConfiguration.tsx
│   │   ├── ReviewSettings.tsx
│   │   └── index.ts
│   └── styles.ts
├── cortex-pulse/
│   ├── CortexPulseTab.tsx
│   ├── components/
│   │   ├── BacklinkStrategy.tsx
│   │   ├── BasicInfoSection.tsx
│   │   ├── ProfessionalBackground.tsx
│   │   ├── ExpertiseSection.tsx
│   │   ├── MediaCommunitySection.tsx
│   │   └── index.ts
│   └── styles.ts
├── review-management/
│   ├── ReviewManagementTab.tsx
│   ├── components/
│   │   ├── AutomationSettings.tsx
│   │   ├── ReviewPublishing.tsx
│   │   └── index.ts
│   └── styles.ts
├── promotions/
│   ├── PromotionsTab.tsx
│   ├── components/
│   │   ├── PromotionDetails.tsx
│   │   ├── PromotionTargeting.tsx
│   │   ├── CompanyContact.tsx
│   │   └── index.ts
│   └── styles.ts
└── ownership-questions/
    ├── OwnershipQuestionsTab.tsx
    ├── components/
    │   ├── FranchiseSection.tsx
    │   ├── PrivateEquitySection.tsx
    │   └── index.ts
    └── styles.ts
```

### Files to Update
- `EditOnboarding.tsx` - Add new tabs to TabConfig
- `ShowOnboarding.tsx` - Add new show sections
- All existing tab files - Add new fields
- `utils/index.ts` - Update data transformation functions

## Testing Checklist

### Form Functionality
- [ ] All new fields render correctly
- [ ] Form validation works for new fields
- [ ] Data submission includes all new fields
- [ ] Form loads existing data correctly

### UI/UX
- [ ] Consistent styling with existing forms
- [ ] Responsive design works on all screen sizes
- [ ] Tab navigation works smoothly
- [ ] Form sections are logically organized

### Data Integrity
- [ ] Budget fields store values in cents
- [ ] JSON fields handle arrays and objects correctly
- [ ] Enum fields validate against allowed values
- [ ] Default values are set correctly

### Integration
- [ ] Form integrates with existing API endpoints
- [ ] Data transformation works correctly
- [ ] File uploads work with new FileUploadField
- [ ] Form state management works properly

## Key Missing Functionality Identified

### 1. **Promotions Management** 
- Year-round promotions configuration
- Seasonal offers and specials
- Discount management and targeting
- Company contact information for promotions

### 2. **Ownership-Specific Questions**
- Franchise-specific fields (network scope, brand guidelines, marketing decisions)
- Private Equity-specific fields (firm information, portfolio management, growth goals)
- Conditional rendering based on ownership type

### 3. **Advanced Business Information**
- DBA (Doing Business As) field
- Business hours configuration
- Language preferences
- Advanced contact information

### 4. **Dealer Interests**
- Speaker engagement options
- Training and webinar preferences
- Custom dealer program configuration

### 5. **Google Business Profile Access**
- GBP access verification
- Local SEO feature enablement based on access

### 6. **Client Status Tracking**
- Current vs new client identification
- Tailored onboarding based on client status

### 7. **Template Selection**
- Website template preferences
- Template tournament functionality
- Industry-specific template recommendations

### 8. **Source Platform Tracking**
- Lead source identification
- Platform-specific configuration

## Conclusion

This refactor represents a significant update to align the Synapse organization forms with the current schema and onboard app implementation. The changes will provide a more comprehensive and user-friendly interface for managing organization data, with particular focus on budget allocation, author profiles, enhanced Cortex AI configuration, and several missing functionalities from the onboard app.

The implementation should be done in phases to ensure stability and allow for proper testing at each stage. Priority should be given to critical updates first, followed by new functionality, and finally UI/UX improvements.

This comprehensive refactor ensures the Synapse organization forms capture all the rich functionality available in the onboard app while maintaining the existing UI quality and user experience.
