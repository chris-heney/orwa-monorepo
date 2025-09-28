export const validateDomain = (value: string) => {
    if (!value) return 'Domain is required';

    // Remove common protocol prefixes if present
    const cleanValue = value.replace(/^https?:\/\//, '').replace(/^www\./, '');

    // Check for basic domain format
    const domainRegex =
        /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+$/;
    if (!domainRegex.test(cleanValue)) {
        return 'Please enter a valid domain name (e.g., example.com)';
    }

    // Check for invalid characters
    if (cleanValue.includes('_')) {
        return 'Domain names cannot contain underscores';
    }

    // Check domain length
    if (cleanValue.length > 253) {
        return 'Domain name is too long (max 253 characters)';
    }

    // Check for consecutive dots
    if (cleanValue.includes('..')) {
        return 'Domain name cannot contain consecutive dots';
    }

    // Check for valid TLD
    const parts = cleanValue.split('.');
    const tld = parts[parts.length - 1];
    if (tld.length < 2) {
        return 'Domain must have a valid top-level domain';
    }

    return undefined;
};

export const validateUrl = (value: string) => {
    if (!value) return undefined; // URL is optional

    // Check for basic URL format
    if (!value.startsWith('http://') && !value.startsWith('https://')) {
        return 'URL must start with http:// or https://';
    }

    try {
        const url = new URL(value);

        // Check for valid protocol
        if (!['http:', 'https:'].includes(url.protocol)) {
            return 'URL must use HTTP or HTTPS protocol';
        }

        // Check for valid hostname
        if (!url.hostname || url.hostname.length < 3) {
            return 'URL must have a valid hostname';
        }

        // Check for localhost in production (warning)
        if (url.hostname === 'localhost' || url.hostname === '127.0.0.1') {
            return 'Warning: Localhost URLs are not accessible externally';
        }

        return undefined;
    } catch {
        return 'Please enter a valid URL (e.g., https://example.com)';
    }
};

export const validateDnsRecord = (type: string, value: string) => {
    if (!value) return 'DNS record value is required';

    switch (type.toLowerCase()) {
        case 'a':
            // IPv4 address validation
            const ipv4Regex =
                /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
            if (!ipv4Regex.test(value)) {
                return 'Please enter a valid IPv4 address (e.g., 192.168.1.1)';
            }
            break;

        case 'aaaa':
            // IPv6 address validation (basic)
            const ipv6Regex = /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;
            if (!ipv6Regex.test(value)) {
                return 'Please enter a valid IPv6 address';
            }
            break;

        case 'cname':
            // CNAME should be a valid domain
            const cnameValidation = validateDomain(value);
            if (cnameValidation) {
                return `CNAME ${cnameValidation.toLowerCase()}`;
            }
            break;

        case 'mx':
            // MX record format: priority hostname
            const mxParts = value.split(' ');
            if (mxParts.length !== 2) {
                return 'MX record must be in format "priority hostname" (e.g., "10 mail.example.com")';
            }

            const priority = parseInt(mxParts[0]);
            if (isNaN(priority) || priority < 0 || priority > 65535) {
                return 'MX priority must be a number between 0 and 65535';
            }

            const hostname = mxParts[1];
            const hostnameValidation = validateDomain(hostname);
            if (hostnameValidation) {
                return `MX hostname ${hostnameValidation.toLowerCase()}`;
            }
            break;

        case 'txt':
            // TXT records can contain most characters, but check length
            if (value.length > 255) {
                return 'TXT record value cannot exceed 255 characters';
            }
            break;

        case 'ns':
            // NS record should be a valid domain
            const nsValidation = validateDomain(value);
            if (nsValidation) {
                return `NS ${nsValidation.toLowerCase()}`;
            }
            break;

        default:
            return 'Unknown DNS record type';
    }

    return undefined;
};

export const validateTechnology = (value: string) => {
    if (!value) return undefined; // Technology is optional

    const validTechnologies = [
        'WordPress',
        'Webflow',
        'Static',
        'React',
        'Vue',
        'Angular',
        'Next.js',
        'Gatsby',
        'Nuxt.js',
        'Svelte',
        'Other',
    ];

    if (!validTechnologies.includes(value)) {
        return 'Please select a valid technology from the list';
    }

    return undefined;
};

export const getDomainHealth = (domain: any) => {
    const checks = [
        { name: 'URL', value: Boolean(domain.url), required: true },
        {
            name: 'Technology',
            value: Boolean(domain.technology),
            required: true,
        },
        { name: 'Server', value: Boolean(domain.serverId), required: false },
        {
            name: 'Organization',
            value: Boolean(domain.organizationId),
            required: false,
        },
        {
            name: 'DNS Records',
            value: Boolean(
                domain.aRecords?.length ||
                    domain.cnameRecords?.length ||
                    domain.mxRecords?.length ||
                    domain.txtRecords?.length ||
                    domain.nsRecords?.length
            ),
            required: false,
        },
    ];

    const requiredChecks = checks.filter(check => check.required);
    const passedRequired = requiredChecks.filter(check => check.value).length;
    const passedOptional = checks.filter(
        check => !check.required && check.value
    ).length;

    const score = (passedRequired + passedOptional) / checks.length;

    let status: 'excellent' | 'good' | 'fair' | 'poor' | 'critical';
    let color: 'success' | 'info' | 'warning' | 'error';

    if (passedRequired === requiredChecks.length) {
        if (score >= 0.8) {
            status = 'excellent';
            color = 'success';
        } else if (score >= 0.6) {
            status = 'good';
            color = 'info';
        } else {
            status = 'fair';
            color = 'warning';
        }
    } else if (passedRequired > 0) {
        status = 'poor';
        color = 'warning';
    } else {
        status = 'critical';
        color = 'error';
    }

    return {
        score: Math.round(score * 100),
        status,
        color,
        checks,
        passedRequired,
        totalRequired: requiredChecks.length,
        passedOptional,
        totalOptional: checks.length - requiredChecks.length,
    };
};

export const formatDomainForDisplay = (domain: string) => {
    // Remove protocol and www prefix for display
    return domain.replace(/^https?:\/\//, '').replace(/^www\./, '');
};

export const generateDomainSuggestions = (domain: string) => {
    const cleanDomain = formatDomainForDisplay(domain);
    const parts = cleanDomain.split('.');

    if (parts.length < 2) return [];

    const baseName = parts[0];
    const tld = parts[parts.length - 1];

    const suggestions = [];

    // Common TLD alternatives
    const commonTlds = ['com', 'net', 'org', 'io', 'app', 'dev'];
    commonTlds.forEach(altTld => {
        if (altTld !== tld) {
            suggestions.push(`${baseName}.${altTld}`);
        }
    });

    // www subdomain
    if (!cleanDomain.startsWith('www.')) {
        suggestions.push(`www.${cleanDomain}`);
    }

    // api subdomain
    suggestions.push(`api.${cleanDomain}`);

    // app subdomain
    suggestions.push(`app.${cleanDomain}`);

    return suggestions.slice(0, 5); // Return max 5 suggestions
};

export const isDomainExpiringSoon = (
    domain: any,
    daysThreshold: number = 30
) => {
    // This would typically check domain expiration date
    // For now, we'll use a placeholder implementation
    if (!domain.expirationDate) return false;

    const expirationDate = new Date(domain.expirationDate);
    const now = new Date();
    const daysUntilExpiration = Math.ceil(
        (expirationDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );

    return daysUntilExpiration <= daysThreshold;
};

export const getDnsRecordSummary = (domain: any) => {
    const records = {
        A: domain.aRecords || [],
        AAAA: domain.aaaaRecords || [],
        CNAME: domain.cnameRecords || [],
        MX: domain.mxRecords || [],
        TXT: domain.txtRecords || [],
        NS: domain.nsRecords || [],
    };

    const total = Object.values(records).reduce(
        (sum, recordList) => sum + recordList.length,
        0
    );
    const hasBasicRecords = records.A.length > 0 || records.CNAME.length > 0;
    const hasMailRecords = records.MX.length > 0;
    const hasSecurityRecords = records.TXT.length > 0;

    return {
        records,
        total,
        hasBasicRecords,
        hasMailRecords,
        hasSecurityRecords,
        completeness:
            hasBasicRecords && hasMailRecords && hasSecurityRecords
                ? 'complete'
                : hasBasicRecords && hasMailRecords
                ? 'good'
                : hasBasicRecords
                ? 'basic'
                : 'minimal',
    };
};
