import { raAuditLogLanguageEnglish } from '@react-admin/ra-audit-log';
import { RaTreeTranslationMessages } from '@react-admin/ra-tree';
import englishMessages from 'ra-language-english';
import {
    TranslationMessages as BaseTranslationMessages,
    mergeTranslations,
} from 'react-admin';

export interface TranslationMessages
    extends RaTreeTranslationMessages,
        BaseTranslationMessages {}

const customEnglishMessages: TranslationMessages = mergeTranslations(
    englishMessages,
    raAuditLogLanguageEnglish,
    {
        'ra-tree': {
            action: {
                add_root: 'Add a category of products',
            },
        },
        'ra-search': {
            result: `1 result |||| %{smart_count} results`,
        },
        'ra-realtime': {
            notification: {
                lock: {
                    lockedBySomeoneElse: 'The record is locked by someone else',
                },
            },
        },
        pos: {
            profile: 'Profile',
            search: 'Search',
            configuration: 'Configuration',
            language: 'Language',
            change_language: 'Change language',
            theme: {
                name: 'Theme',
                light: 'Light',
                dark: 'Dark',
                change_theme: 'Change theme',
            },
            filter: 'Filtered by',
            dashboard: {
                tickets_open: 'Tickets Open',
                tickets_closed: 'Tickets Closed',
                tasks_open: 'Tasks Open',
                tasks_closed: 'Tasks Closed',
                monthly_revenue: 'Monthly Revenue',
                mrr_ratio: 'MRR Ratio',
                projects_started: 'Projects Started',
                projects_completed: 'Projects Completed',
                leads: 'Leads',
                deals: 'Deals',
                openai_calls: 'OpenAI Calls',
                google_calls: 'Google Calls',
                seo_data_calls: 'SEO Data Calls',
                anthropic_calls: 'Anthropic Calls',
                month_history: '30 Day Revenue History',
                new_orders: 'New Orders',
                pending_reviews: 'Pending Reviews',
                new_customers: 'New Customers',
                pending_orders: 'Pending Orders',
                all_customers: 'All Customers',
                all_reviews: 'All reviews',
                upcoming_announcements: 'Upcoming Announcements',
                no_announcements: 'No announcements at this time',
                activity_stream: 'Activity Stream',
                no_activity: 'No recent activity',
                apps: 'Applications',
                search_apps: 'Search applications...',
                no_apps_found: 'No applications found',
                view_all: 'Manage Apps',
                order: {
                    items: 'by %{customer_name}, one item |||| by %{customer_name}, %{nb_items} items',
                },
                timeline: 'Timeline',
                banner: {
                    title: 'Welcome to Synapse',
                    subtitle: 'Manage your client organizations and their information',
                },
                welcome: {
                    title: 'Welcome to the <strong>CI Synapse&trade;</strong>',
                    subtitle:
                        'The custom-tailored solution for MarTech professionals, built by us, for us. This all-in-one platform brings together everything we need to manage our servers, websites, keywords, reporting, and digital assets, all while ensuring complete ownership of our data and its structure. With AI-driven insights, enhanced workflow productivity, and unparalleled stakeholder visibility, the portal empowers us to work smarter and more efficiently.',
                    subtitle2:
                        "Designed with rapid adaptability in mind, the CI Work Portal evolves through continuous feedback loops from the very people who use it—our technology and marketing teams—leveraging CI/CD automation to deliver updates and improvements at the speed of innovation. Free from third-party constraints and built on our own APIs and containerized infrastructure, this is more than just a tool; it's a reflection of our expertise and a foundation for our growth.",
                    tour_button: 'Take the tour',
                    ra_button: 'Visit CIWEBGROUP.COM',
                    demo_button: 'See the showcase',
                    github_button: 'Contribute Code',
                },
            },
            menu: {
                companySettings: 'Company Settings',
                technology: 'Technology',
                sales: 'Sales',
                catalog: 'Catalog',
                my_queries: 'My queries',
                customers: 'Customers',
                new_customers: 'New Customers',
                all_customers: 'All Customers',
                visitors: 'Visitors',
                all_reviews: 'All reviews',
                pending_reviews: 'Pending reviews',
                bad_reviews: 'Bad reviews',
                domains: 'Domain Management',
                organizations: 'Organizations',
                support: 'Support',
                dns_change: 'DNS',
                design_change: 'Design',
                seo_change: 'SEO',
                ppc_change: 'PPC',
                social_change: 'Social',
                content_change: 'Content',
                brand_change: 'Brand',
                analytics_change: 'Analytics',
                coreServices: 'Core Services',
                serviceContext: 'Service Context',
                applications: 'Applications',
                readySetGo: 'ReadySetGo',
                asana: 'Asana',
                lobeChat: 'Lobe Chat',
                helpDesk: 'Help Desk',
                changeRequests: 'Change Requests',
                configureSynapse: 'Configure Synapse',
                onboard: 'Onboard',
                rbac: 'Roles & Capabilities',
            },
            reviews: {
                accepted: 'Accepted',
                rejected: 'Rejected',
                pending: 'Pending',
            },
            events: {
                review: {
                    title: 'Posted review on "%{product}"',
                },
                order: {
                    title: 'Ordered 1 poster |||| Ordered %{smart_count} posters',
                },
            },
        },
        resources: {
            customers: {
                name: 'Customer |||| Customers',
                fields: {
                    orders: 'Orders',
                    first_seen: 'First seen',
                    groups: 'Segments',
                    last_seen: 'Last seen',
                    last_seen_gte: 'Visited Since',
                    name: 'Name',
                    total_spent: 'Total spent',
                    password: 'Password',
                    confirm_password: 'Confirm password',
                    address: 'Address',
                    birthday: 'Birthday',
                    city: 'City',
                    first_name: 'First name',
                    has_newsletter: 'Has Newsletter',
                    has_ordered: 'Has ordered',
                    last_name: 'Last name',
                    latest_purchase: 'Latest purchase',
                    zipcode: 'Postal code',
                    nb_orders: 'Orders',
                },
                filters: {
                    last_visited: 'Last visited',
                    today: 'Today',
                    this_week: 'This week',
                    last_week: 'Last week',
                    this_month: 'This month',
                    last_month: 'Last month',
                    earlier: 'Earlier',
                    has_ordered: 'Has ordered',
                    has_newsletter: 'Has newsletter',
                    group: 'Segment',
                },
                fieldGroups: {
                    identity: 'Identity',
                    address: 'Address',
                    stats: 'Stats',
                    history: 'History',
                    password: 'Password',
                    change_password: 'Change Password',
                },
                page: {
                    delete: 'Delete Customer',
                },
                errors: {
                    password_mismatch:
                        'The password confirmation is not the same as the password.',
                },
            },
            locks: {
                overlay: 'Currently Edited by %{name}',
            },
            events: {
                name: 'Events',
            },

            domains: {
                name: 'Domain |||| Domains',
                filters: {
                    all_domains: 'All Domains',
                    active_domains: 'Active Domains',
                    expired_domains: 'Expired Domains',
                    servers: 'Servers',
                    all_servers: 'All Servers',
                    active_servers: 'Active Servers',
                    inactive_servers: 'Inactive Servers',
                },
            },
            organizations: {
                name: 'Organization |||| Organizations',
            },
        },
    }
);

export default customEnglishMessages;
