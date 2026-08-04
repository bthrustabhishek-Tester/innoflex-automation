export interface AddressData {
    addressLine1: string;
    addressLine2: string;
    unitNumber: string;
    postalCode: string;
    city?: string;
    state?: string;
    country: 'Singapore' | 'Malaysia';
}

export interface FullDataSet {
    country: 'MY' | 'SG';
    salutation: string;
    firstName: string;
    lastName: string;
    companyName: string;
    uenOrSsm: string;
    mobileNumber: string;
    formattedMobileNumber: string;
    landlineNumber: string;
    email: string;
    website: string;
    address: AddressData;
}

export class RandomData {
    private static currentCountry: 'MY' | 'SG' = 'SG';
    private static sequenceCounter: number = 27;

    /**
     * Set active country ('SG' for Singapore, 'MY' for Malaysia)
     */
    static setCountry(country: 'MY' | 'SG') {
        this.currentCountry = country;
    }

    static getCountry(): 'MY' | 'SG' {
        return this.currentCountry;
    }

    /**
     * Get next 4-digit sequential counter string (e.g. 0027, 0028)
     */
    static getNextSequenceNumber(): string {
        const current = this.sequenceCounter++;
        return String(current).padStart(4, '0');
    }

    /**
     * Generate a random valid Lead Name containing ONLY letters (NO numbers, NO special characters)
     * e.g. "Lead Global Enterprise", "Lead Apex Solutions", "Lead Vision Strategy"
     */
    static getRandomValidLeadName(prefix: string = 'Lead'): string {
        const words = [
            'Global', 'Nexus', 'Prime', 'Apex', 'Vision', 'Elite', 'Bright',
            'Ocean', 'Star', 'Mega', 'Omni', 'Vanguard', 'Pacific', 'Alpha',
            'Pioneer', 'Executive', 'Innovation', 'Strategy', 'Horizon', 'Alliance',
            'Enterprise', 'Solutions', 'Ventures', 'Synergy', 'Capital', 'Dynamic'
        ];
        const word1 = words[Math.floor(Math.random() * words.length)];
        let word2 = words[Math.floor(Math.random() * words.length)];
        while (word2 === word1) {
            word2 = words[Math.floor(Math.random() * words.length)];
        }
        return `${prefix} ${word1} ${word2}`;
    }

    /**
     * Generate sequential Lead Title (e.g. "Lead Tst 0027", "Lead Tst 0028")
     */
    static getSequentialLeadTitle(prefix: string = 'Lead Tst'): string {
        const seq = this.getNextSequenceNumber();
        return `${prefix} ${seq}`;
    }

    /**
     * Generate sequential clean email address without underscores (e.g. "test0027@gmail.com")
     */
    static getSequentialEmail(prefix: string = 'test', domain: string = 'gmail.com'): string {
        const seq = String(this.sequenceCounter).padStart(4, '0');
        return `${prefix}${seq}@${domain}`;
    }

    /**
     * Generate a unique clean email address with letters & numbers only (no underscores)
     * e.g. "test0027@gmail.com"
     */
    static getRandomEmail(domain: string = 'gmail.com'): string {
        const seq = this.getNextSequenceNumber();
        return `test${seq}@${domain}`;
    }

    /**
     * Pick a random country ('SG' or 'MY')
     */
    static getRandomCountryChoice(): 'MY' | 'SG' {
        return Math.random() > 0.5 ? 'SG' : 'MY';
    }

    /**
     * Generate a random alphabetic string of specified length (letters only)
     */
    static getRandomString(length: number): string {
        const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return result;
    }

    /**
     * Generate a random numeric string of specified length
     */
    static getRandomNumber(length: number): string {
        let result = '';
        for (let i = 0; i < length; i++) {
            result += Math.floor(Math.random() * 10).toString();
        }
        return result;
    }

    /**
     * Generate a salutation based on country
     */
    static getRandomSalutation(country: 'MY' | 'SG' = this.currentCountry): string {
        const sgSalutations = ['Mr.', 'Ms.', 'Mrs.', 'Dr.'];
        const mySalutations = ['Mr.', 'Ms.', 'Mrs.', 'Encik', 'Puan', 'Cik', 'Dato\''];
        const salutations = country === 'MY' ? mySalutations : sgSalutations;
        return salutations[Math.floor(Math.random() * salutations.length)];
    }

    /**
     * Generate a realistic First Name for SG or MY
     */
    static getRandomFirstName(country: 'MY' | 'SG' = this.currentCountry): string {
        const sgNames = [
            'Jason', 'Kevin', 'Michelle', 'Sarah', 'Wei Ming', 'Sivaraj', 'Jia En',
            'Zi Hao', 'Chloe', 'Ryan', 'Desmond', 'Xavier', 'Marcus', 'Serene',
            'Fiona', 'Benjamin', 'Derrick', 'Evelyn', 'Rachel', 'Justin'
        ];
        const myNames = [
            'Ahmad', 'Muhammad', 'Siti', 'Nur', 'Zulkifli', 'Fatimah', 'Yusof',
            'Mohan', 'Raj', 'Tan', 'Lim', 'Chong', 'Anwar', 'Hassan',
            'Kassim', 'Nor', 'Khairul', 'Azman', 'Farid', 'Sharifah'
        ];
        const names = country === 'MY' ? myNames : sgNames;
        return names[Math.floor(Math.random() * names.length)];
    }

    /**
     * Generate a realistic Last Name for SG or MY
     */
    static getRandomLastName(country: 'MY' | 'SG' = this.currentCountry): string {
        const sgNames = [
            'Tan', 'Lee', 'Lim', 'Wong', 'Ng', 'Chua', 'Rajaratnam', 'Koh',
            'Teo', 'Low', 'Ang', 'Seow', 'Tay', 'Poh', 'Goh', 'Cheong'
        ];
        const myNames = [
            'Abdullah', 'Ibrahim', 'Kassim', 'Ismail', 'Chen', 'Wong', 'Raman',
            'Krishnan', 'Othman', 'Bakar', 'Hamzah', 'Low', 'Tee', 'Yip', 'Razak'
        ];
        const names = country === 'MY' ? myNames : sgNames;
        return names[Math.floor(Math.random() * names.length)];
    }

    /**
     * Generate a realistic Company Name formatted for SG or MY
     */
    static getRandomCompanyName(country: 'MY' | 'SG' = this.currentCountry): string {
        const prefixes = [
            'Global', 'Nexus', 'Prime', 'Apex', 'Vision', 'Elite', 'Bright',
            'Ocean', 'Star', 'Mega', 'InnoFlex', 'Omni', 'Vanguard', 'Pacific'
        ];
        const sgSuffixes = ['Pte Ltd', 'Services Pte Ltd', 'Trading Pte Ltd', 'Holdings Pte Ltd', 'Technologies Pte Ltd'];
        const mySuffixes = ['Sdn Bhd', 'Berhad', 'Holdings Sdn Bhd', 'Trading Sdn Bhd', 'Enterprise'];
        
        const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
        const code = this.getRandomString(4).toUpperCase();
        const suffix = country === 'MY' 
            ? mySuffixes[Math.floor(Math.random() * mySuffixes.length)]
            : sgSuffixes[Math.floor(Math.random() * sgSuffixes.length)];

        return `${prefix} ${code} ${suffix}`;
    }

    /**
     * Generate a valid Singapore UEN (9-10 digits followed by 1 uppercase letter)
     * e.g. 202112345K or 168790088H
     */
    static getRandomUEN(country: 'MY' | 'SG' = this.currentCountry): string {
        const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const randomLetter = letters.charAt(Math.floor(Math.random() * letters.length));
        const year = 2015 + Math.floor(Math.random() * 10);
        const digits = this.getRandomNumber(5);
        return `${year}${digits}${randomLetter}`;
    }

    /**
     * Generate valid Mobile Phone Numbers based on Country
     * - Malaysia (MY): 012xxxxxxx, 013xxxxxxx, 014xxxxxxx, 016xxxxxxx, 017xxxxxxx, 018xxxxxxx, 019xxxxxxx (10-11 digits) or formatted +60 12-345 6789
     * - Singapore (SG): 8xxxxxxx, 9xxxxxxx (8 digits) or formatted +65 8123 4567
     */
    static getRandomPhoneNumber(country: 'MY' | 'SG' = this.currentCountry, formatted: boolean = false): string {
        if (country === 'SG') {
            const prefixes = ['8', '9'];
            const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
            const number = `${prefix}${this.getRandomNumber(7)}`;
            return formatted ? `+65 ${number.slice(0, 4)} ${number.slice(4)}` : number;
        } else {
            const prefixes = ['012', '013', '014', '016', '017', '018', '019'];
            const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
            const number = `${prefix}${this.getRandomNumber(7)}`;
            return formatted ? `+60 ${number.slice(1, 3)}-${number.slice(3, 6)} ${number.slice(6)}` : number;
        }
    }

    /**
     * Generate valid Landline / DID Numbers based on Country
     * - Malaysia (MY): 03xxxxxxx (KL/Selangor), 04xxxxxxx (Penang), 07xxxxxxx (Johor)
     * - Singapore (SG): 6xxxxxxx (8 digits)
     */
    static getRandomLandline(country: 'MY' | 'SG' = this.currentCountry): string {
        if (country === 'SG') {
            return `6${this.getRandomNumber(7)}`;
        } else {
            const prefixes = ['03', '04', '07'];
            const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
            return `${prefix}${this.getRandomNumber(7)}`;
        }
    }

    /**
     * Generate valid Singapore or Malaysia Postal Code
     * - Singapore: 6-digit numeric (e.g. 048624, 680123)
     * - Malaysia: 5-digit numeric (e.g. 50450, 10000)
     */
    static getRandomPostalCode(country: 'MY' | 'SG' = this.currentCountry): string {
        if (country === 'SG') {
            const sectors = ['01', '04', '12', '18', '23', '40', '52', '68', '75', '82'];
            const sector = sectors[Math.floor(Math.random() * sectors.length)];
            return `${sector}${this.getRandomNumber(4)}`;
        } else {
            const myPostcodes = ['50450', '50088', '40000', '10000', '80000', '93000', '88000'];
            return myPostcodes[Math.floor(Math.random() * myPostcodes.length)];
        }
    }

    /**
     * Generate a realistic Street Address based on Country
     */
    static getRandomAddress(country: 'MY' | 'SG' = this.currentCountry): AddressData {
        if (country === 'SG') {
            const streets = [
                'Orchard Road', 'Marina Gardens Drive', 'Ubi Crescent', 'Geylang Road',
                'Emerald Hill Road', 'Teck Whye Lane', 'Upper Changi Road East',
                'Burgundy Crescent', 'Choa Chu Kang Avenue 5', 'Edgedale Plains'
            ];
            const buildings = [
                'TechPark', 'Sunshine Court', 'East View Garden', 'PCF Sparkletots',
                'Burgundy Hill', 'Ever Lodge', '111 Emerald Hill', 'Active Garden'
            ];
            const street = streets[Math.floor(Math.random() * streets.length)];
            const building = buildings[Math.floor(Math.random() * buildings.length)];
            const block = Math.floor(Math.random() * 800) + 1;
            const unitFloor = String(Math.floor(Math.random() * 30) + 1).padStart(2, '0');
            const unitNo = String(Math.floor(Math.random() * 150) + 1).padStart(2, '0');

            return {
                addressLine1: `${block} ${street}`,
                addressLine2: building,
                unitNumber: `#${unitFloor}-${unitNo}`,
                postalCode: this.getRandomPostalCode('SG'),
                country: 'Singapore'
            };
        } else {
            const streets = [
                'Jalan Ampang', 'Jalan Bukit Bintang', 'Persiaran KLCC', 'Jalan Tun Razak',
                'Lebuh Farquhar', 'Jalan Wong Ah Fook', 'Jalan Sultan Ismail', 'Jalan Masjid India'
            ];
            const areas = [
                'Kuala Lumpur', 'Petaling Jaya', 'Shah Alam', 'Georgetown', 'Johor Bahru'
            ];
            const states = [
                'Wilayah Persekutuan', 'Selangor', 'Penang', 'Johor'
            ];

            const street = streets[Math.floor(Math.random() * streets.length)];
            const city = areas[Math.floor(Math.random() * areas.length)];
            const state = states[Math.floor(Math.random() * states.length)];
            const block = Math.floor(Math.random() * 150) + 1;
            const unitFloor = String(Math.floor(Math.random() * 20) + 1).padStart(2, '0');
            const unitNo = String(Math.floor(Math.random() * 50) + 1).padStart(2, '0');

            return {
                addressLine1: `No. ${block}, ${street}`,
                addressLine2: city,
                unitNumber: `Unit ${unitFloor}-${unitNo}`,
                postalCode: this.getRandomPostalCode('MY'),
                city: city,
                state: state,
                country: 'Malaysia'
            };
        }
    }

    /**
     * Generate a website URL
     */
    static getRandomWebsite(companyName?: string): string {
        const cleanName = companyName 
            ? companyName.toLowerCase().replace(/[^a-z0-9]/g, '')
            : this.getRandomString(8);
        return `https://www.${cleanName}.com`;
    }

    /**
     * Generate a complete, 100% random dataset for either SG or MY
     */
    static getFullRandomDataSet(country: 'MY' | 'SG' = this.currentCountry): FullDataSet {
        const companyName = this.getRandomCompanyName(country);
        return {
            country,
            salutation: this.getRandomSalutation(country),
            firstName: this.getRandomFirstName(country),
            lastName: this.getRandomLastName(country),
            companyName,
            uenOrSsm: this.getRandomUEN(country),
            mobileNumber: this.getRandomPhoneNumber(country, false),
            formattedMobileNumber: this.getRandomPhoneNumber(country, true),
            landlineNumber: this.getRandomLandline(country),
            email: this.getRandomEmail(),
            website: this.getRandomWebsite(companyName),
            address: this.getRandomAddress(country)
        };
    }
}
