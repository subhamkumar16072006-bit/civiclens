// src/lib/translations.ts

export type Locale = 'en' | 'hi' | 'pa';

export const translations: Record<Locale, Record<string, string>> = {
    en: {
        // Sidebar
        'nav.dashboard': 'Dashboard',
        'nav.report_issue': 'Report Issue',
        'nav.community_map': 'Community Map',
        'nav.my_contributions': 'My Contributions',
        'nav.officer_hq': 'Officer HQ',
        'nav.new_report': 'NEW REPORT',
        'nav.contributor': 'Contributor',
        'nav.sign_out': 'Sign Out',
        'nav.sign_in': 'Sign In',
        'nav.verified': 'Verified',
        'nav.civic_leaders': 'Civic Leaders',
        'nav.no_leaders': 'No leaders yet.',
        'nav.view_all_rankings': 'VIEW ALL RANKINGS',

        // Header
        'header.title': 'Community Dashboard',
        'header.search_placeholder': 'Search sectors...',
        'header.welcome': 'Welcome',
        'header.welcome_user': 'Welcome, {name}',

        // Metrics
        'metrics.total_reported': 'Total Issues Reported',
        'metrics.resolved': 'Resolved',
        'metrics.pending': 'Pending',
        'metrics.resolution_rate': 'Resolution Rate',
        'metrics.system_health': 'System Health',
        'metrics.optimal': 'Optimal',
        'metrics.live': 'Live',
        'metrics.live_activity': 'Live Activity',

        // Reports Table
        'table.title': 'Active Sector Reports',
        'table.refresh': 'REFRESH',
        'table.report_id': 'Report ID',
        'table.description': 'Description',
        'table.category': 'Category',
        'table.status': 'Status',
        'table.date': 'Date',
        'table.no_reports': 'No reports found. Submit your first issue!',

        // Status Labels
        'status.pending': 'PENDING',
        'status.analyzing': 'ANALYZING',
        'status.validated': 'VALIDATED',
        'status.assigned': 'ASSIGNED',
        'status.in_progress': 'IN PROGRESS',
        'status.resolved': 'RESOLVED',
        'status.rejected': 'REJECTED',

        // Active Resolution Section
        'active.section_title': 'Active Resolution',
        'active.section_sub': 'Currently pending fixes',
        'active.tracker_title': 'Active Resolution Tracker',
        'active.tracker_sub': 'Tracking progress on reported civic issues',
        'active.citizen_photo': 'Citizen Photo',
        'active.authority_action': 'Authority Action',
        'active.pending_fix': 'PENDING FIX',
        'active.awaiting_verification': 'Awaiting visual verification',
        'active.ai_priority_score': 'AI Priority Score',
        'active.issue_description': 'This {category} issue has been analyzed for risk severity. Authorities have been notified and it is currently sitting in {status} triage state.',
        'active.no_active_fixes': 'No active pending resolutions right now.',

        // Map Labels
        'map.title': 'Active Reports Map',
        'map.location': 'LPU Phagwara • Live Setup'
    },
    hi: {
        // Sidebar
        'nav.dashboard': 'डैशबोर्ड',
        'nav.report_issue': 'समस्या दर्ज करें',
        'nav.community_map': 'सामुदायिक मानचित्र',
        'nav.my_contributions': 'मेरा योगदान',
        'nav.officer_hq': 'अधिकारी मुख्यालय',
        'nav.new_report': 'नई रिपोर्ट',
        'nav.contributor': 'योगदानकर्ता',
        'nav.sign_out': 'साइन आउट',
        'nav.sign_in': 'साइन इन',
        'nav.verified': 'सत्यापित',
        'nav.civic_leaders': 'सिविक लीडर्स',
        'nav.no_leaders': 'अभी कोई लीडर नहीं है।',
        'nav.view_all_rankings': 'सभी रैंकिंग देखें',

        // Header
        'header.title': 'सामुदायिक डैशबोर्ड',
        'header.search_placeholder': 'सेक्टर खोजें...',
        'header.welcome': 'स्वागत है',
        'header.welcome_user': 'स्वागत है, {name}',

        // Metrics
        'metrics.total_reported': 'कुल रिपोर्ट की गई समस्याएं',
        'metrics.resolved': 'सुलझाया गया',
        'metrics.pending': 'लंबित',
        'metrics.resolution_rate': 'समाधान दर',
        'metrics.system_health': 'सिस्टम स्वास्थ्य',
        'metrics.optimal': 'इष्टतम',
        'metrics.live': 'लाइव',
        'metrics.live_activity': 'लाइव गतिविधि',

        // Reports Table
        'table.title': 'सक्रिय सेक्टर रिपोर्ट',
        'table.refresh': 'रीफ्रेश',
        'table.report_id': 'रिपोर्ट आईडी',
        'table.description': 'विवरण',
        'table.category': 'श्रेणी',
        'table.status': 'स्थिति',
        'table.date': 'दिनांक',
        'table.no_reports': 'कोई रिपोर्ट नहीं मिली। अपनी पहली समस्या सबमिट करें!',

        // Status Labels
        'status.pending': 'लंबित',
        'status.analyzing': 'विश्लेषण जारी',
        'status.validated': 'सत्यापित',
        'status.assigned': 'सौंपा गया',
        'status.in_progress': 'प्रगति पर',
        'status.resolved': 'सुलझाया गया',
        'status.rejected': 'अस्वीकृत',

        // Active Resolution Section
        'active.section_title': 'सक्रिय समाधान',
        'active.section_sub': 'वर्तमान में लंबित सुधार',
        'active.tracker_title': 'सक्रिय समाधान ट्रैकर',
        'active.tracker_sub': 'रिपोर्ट की गई नागरिक समस्याओं पर नज़र रखना',
        'active.citizen_photo': 'नागरिक फोटो',
        'active.authority_action': 'अधिकारी कार्रवाई',
        'active.pending_fix': 'सुधार लंबित',
        'active.awaiting_verification': 'दृश्य सत्यापन की प्रतीक्षा है',
        'active.ai_priority_score': 'AI प्राथमिकता स्कोर',
        'active.issue_description': 'इस {category} समस्या का जोखिम गंभीरता के लिए विश्लेषण किया गया है। अधिकारियों को सूचित कर दिया गया है और यह वर्तमान में {status} स्थिति में है।',
        'active.no_active_fixes': 'अभी कोई सक्रिय लंबित समाधान नहीं है।',

        // Map Labels
        'map.title': 'सक्रिय रिपोर्ट मानचित्र',
        'map.location': 'एलपीयू फगवाड़ा • लाइव सेटअप'
    },
    pa: {
        // Sidebar
        'nav.dashboard': 'ਡੈਸ਼ਬੋਰਡ',
        'nav.report_issue': 'ਸਮੱਸਿਆ ਦੀ ਰਿਪੋਰਟ ਕਰੋ',
        'nav.community_map': 'ਭਾਈਚਾਰਕ ਨਕਸ਼ਾ',
        'nav.my_contributions': 'ਮੇਰੇ ਯੋਗਦਾਨ',
        'nav.officer_hq': 'ਅਫਸਰ ਹੈੱਡਕੁਆਰਟਰ',
        'nav.new_report': 'ਨਵੀਂ ਰਿਪੋਰਟ',
        'nav.contributor': 'ਯੋਗਦਾਨੀ',
        'nav.sign_out': 'ਸਾਈਨ ਆਉਟ',
        'nav.sign_in': 'ਸਾਈਨ ਇਨ',
        'nav.verified': 'ਤਸਦੀਕਸ਼ੁਦਾ',
        'nav.civic_leaders': 'ਸਿਵਿਕ ਲੀਡਰ',
        'nav.no_leaders': 'ਅਜੇ ਕੋਈ ਲੀਡਰ ਨਹੀਂ ਹੈ।',
        'nav.view_all_rankings': 'ਸਾਰੀਆਂ ਰੈਂਕਿੰਗ ਦੇਖੋ',

        // Header
        'header.title': 'ਭਾਈਚਾਰਕ ਡੈਸ਼ਬੋਰਡ',
        'header.search_placeholder': 'ਸੈਕਟਰ ਖੋਜੋ...',
        'header.welcome': 'ਜੀ ਆਇਆਂ ਨੂੰ',
        'header.welcome_user': 'ਜੀ ਆਇਆਂ ਨੂੰ, {name}',

        // Metrics
        'metrics.total_reported': 'ਕੁੱਲ ਰਿਪੋਰਟ ਕੀਤੀਆਂ ਸਮੱਸਿਆਵਾਂ',
        'metrics.resolved': 'ਹੱਲ ਕੀਤਾ ਗਿਆ',
        'metrics.pending': 'ਬਾਕੀ',
        'metrics.resolution_rate': 'ਹੱਲ ਦੀ ਦਰ',
        'metrics.system_health': 'ਸਿਸਟਮ ਦੀ ਸਿਹਤ',
        'metrics.optimal': 'ਅਨੁਕੂਲ',
        'metrics.live': 'ਲਾਈਵ',
        'metrics.live_activity': 'ਲਾਈਵ ਗਤੀਵਿਧੀ',

        // Reports Table
        'table.title': 'ਸਰਗਰਮ ਸੈਕਟਰ ਰਿਪੋਰਟਾਂ',
        'table.refresh': 'ਤਾਜ਼ਾ ਕਰੋ',
        'table.report_id': 'ਰਿਪੋਰਟ ਆਈ.ਡੀ.',
        'table.description': 'ਵੇਰਵਾ',
        'table.category': 'ਸ਼੍ਰੇਣੀ',
        'table.status': 'ਸਥਿਤੀ',
        'table.date': 'ਮਿਤੀ',
        'table.no_reports': 'ਕੋਈ ਰਿਪੋਰਟ ਨਹੀਂ ਮਿਲੀ। ਆਪਣੀ ਪਹਿਲੀ ਸਮੱਸਿਆ ਦਰਜ ਕਰੋ!',

        // Status Labels
        'status.pending': 'ਬਾਕੀ',
        'status.analyzing': 'ਵਿਸ਼ਲੇਸ਼ਣ ਜਾਰੀ',
        'status.validated': 'ਤਸਦੀਕਸ਼ੁਦਾ',
        'status.assigned': 'ਸੌਂਪਿਆ ਗਿਆ',
        'status.in_progress': 'ਕੰਮ ਜਾਰੀ',
        'status.resolved': 'ਹੱਲ ਕੀਤਾ ਗਿਆ',
        'status.rejected': 'ਰੱਦ ਕੀਤਾ ਗਿਆ',

        // Active Resolution Section
        'active.section_title': 'ਸਰਗਰਮ ਹੱਲ',
        'active.section_sub': 'ਵਰਤਮਾਨ ਵਿੱਚ ਬਾਕੀ ਸੁਧਾਰ',
        'active.tracker_title': 'ਸਰਗਰਮ ਹੱਲ ਟ੍ਰੈਕਰ',
        'active.tracker_sub': 'ਰਿਪੋਰਟ ਕੀਤੀਆਂ ਨਾਗਰਿਕ ਸਮੱਸਿਆਵਾਂ ਦੀ ਨਿਗਰਾਨੀ',
        'active.citizen_photo': 'ਨਾਗਰਿਕ ਦੀ ਫੋਟੋ',
        'active.authority_action': 'ਅਧਿਕਾਰੀਆਂ ਦੀ ਕਾਰਵਾਈ',
        'active.pending_fix': 'ਸੁਧਾਰ ਬਾਕੀ',
        'active.awaiting_verification': 'ਦਿੱਖ ਤਸਦੀਕ ਦੀ ਉਡੀਕ',
        'active.ai_priority_score': 'AI ਤਰਜੀਹ ਸਕੋਰ',
        'active.issue_description': 'ਇਸ {category} ਸਮੱਸਿਆ ਦਾ ਜੋਖਮ ਗੰਭੀਰਤਾ ਲਈ ਵਿਸ਼ਲੇਸ਼ਣ ਕੀਤਾ ਗਿਆ ਹੈ। ਅਧਿਕਾਰੀਆਂ ਨੂੰ ਸੂਚਿਤ ਕਰ ਦਿੱਤਾ ਗਿਆ ਹੈ ਅਤੇ ਇਹ ਇਸ ਸਮੇਂ {status} ਸਥਿਤੀ ਵਿੱਚ ਹੈ।',
        'active.no_active_fixes': 'ਇਸ ਵੇਲੇ ਕੋਈ ਸਰਗਰਮ ਬਾਕੀ ਹੱਲ ਨਹੀਂ ਹਨ।',

        // Map Labels
        'map.title': 'ਸਰਗਰਮ ਰਿਪੋਰਟਾਂ ਦਾ ਨਕਸ਼ਾ',
        'map.location': 'LPU ਫਗਵਾੜਾ • ਲਾਈਵ ਸੈੱਟਅੱਪ'
    }
};
