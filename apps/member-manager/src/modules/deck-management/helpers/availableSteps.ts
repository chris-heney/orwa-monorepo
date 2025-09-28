export interface AvailableStep {
    id: string;
    label: string;
    description: string;
    category: string;
    condition?: string;
}

export const availableSteps: AvailableStep[] = [
    {
        id: 'Welcome',
        label: 'Welcome',
        description: 'Welcome message',
        category: 'welcome',
    },
    {
        id: 'Business Info Advanced',
        label: 'Business Info Advanced',
        description: 'Advanced business information collection',
        category: 'business',
    },
    {
        id: 'Business Info',
        label: 'Business Info',
        description: 'Basic business information collection',
        category: 'business',
    },
    {
        id: 'Contact Info',
        label: 'Contact Info',
        description: 'Contact information collection',
        category: 'contact',
    },
    {
        id: 'Tech Stack',
        label: 'Tech Stack',
        description: 'Technology stack selection and configuration',
        category: 'technical',
    },
    {
        id: 'Budget',
        label: 'Budget',
        description: 'Financial budget planning',
        category: 'financial',
    },
    {
        id: 'Locations',
        label: 'Locations',
        description: 'Business location management',
        category: 'location',
    },
    {
        id: 'Cities',
        label: 'Cities',
        description: 'City selection for business operations',
        category: 'location',
    },
    {
        id: 'Services',
        label: 'Services',
        description: 'Service selection and configuration',
        category: 'services',
    },
    {
        id: 'CoreServices',
        label: 'CoreServices',
        description: 'Core services configuration',
        category: 'services',
    },
    {
        id: 'Source Platform',
        label: 'Source Platform',
        description: 'Platform source tracking',
        category: 'tracking',
    },
    {
        id: 'Terms',
        label: 'Terms',
        description: 'Terms and conditions',
        category: 'terms',
    },
    {
        id: 'Completion Screen',
        label: 'Completion Screen',
        description: 'Process completion confirmation',
        category: 'completion',
    },
    {
        id: 'Enterprise Completion Screen',
        label: 'Enterprise Completion Screen',
        description: 'Enterprise process completion confirmation for franchise/PE',
        category: 'completion',
    },
    {
        id: 'Franchise Questions',
        label: 'Franchise Questions',
        description: 'Franchise-specific questions',
        category: 'conditional',
        condition: 'franchise',
    },
    {
        id: 'Private Equity Questions',
        label: 'Private Equity Questions',
        description: 'Private equity-specific questions',
        category: 'conditional',
        condition: 'private-equity',
    },
    {
        id: 'Template Selection',
        label: 'Template Selection',
        description: 'Template selection',
        category: 'template',
    },
    {
        id: 'Rebate Tax Credit',
        label: 'Rebate Tax Credit',
        description: 'Rebate tax credit information',
        category: 'rebate',
    },  
    {
        id: 'Year Round Promotions',
        label: 'Year Round Promotions',
        description: 'Year round promotions information',
        category: 'promotions',
    },
    // {
    //     id: 'AISite',
    //     label: 'AISite',
    //     description: 'AI Site information',
    //     category: 'AI',
    // },
    // {
    //     id: 'Choose Your Path',
    //     label: 'Choose Your Path',
    //     description: 'Choose your path information',
    //     category: 'choose-your-path',
    // },
    {
        id: 'Social Media Presence',
        label: 'Social Media Presence',
        description: 'Social media presence information',
        category: 'social',
    },
    {
        id: 'Cortex Local',
        label: 'Cortex Local',
        description: 'Automate Google Business posting with AI-powered content generation',
        category: 'automation',
    },
    {
        id: 'Client Info',
        label: 'Client Info',
        description: 'Collect client information and access permissions',
        category: 'client',
    },
    {
        id: 'Branding',
        label: 'Branding',
        description: 'Configure brand colors, logos, and visual identity settings',
        category: 'branding',
    },
    {
        id: 'Cortex SEO',
        label: 'Cortex SEO',
        description: 'Configure SEO objectives, content publishing, and article generation settings',
        category: 'seo',
    },
    {
        id: 'Cortex Pulse',
        label: 'Cortex Pulse',
        description: 'Set up backlink building, PR outreach, and content amplification',
        category: 'marketing',
    },
];

export const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
        welcome: 'success',
        business: 'primary',
        contact: 'secondary',
        technical: 'info',
        financial: 'success',
        location: 'info',
        services: 'warning',
        tracking: 'default',
        completion: 'error',
        terms: 'success',
        conditional: 'purple',
        automation: 'info',
        client: 'secondary',
        branding: 'primary',
        seo: 'info',
        marketing: 'warning',
    };
    return colors[category] || 'default';
}; 