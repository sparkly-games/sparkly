(function() {
    let style = '#our_logo{display:block;z-index:9999;position:absolute;user-select:none}#our_logo.size_140{width:140px;height:18px}#our_logo.size_120{width:120px;height:18px}';

    // Функция для получения домена реферера
    function getReferrerHostname() {
        try {
            if (!document.referrer) return "";
            const url = new URL(document.referrer);
            return url.hostname.toLowerCase();
        } catch (e) {
            return "";
        }
    }

    // Функция для получения источника трафика (для iframe)
    function getTrafficSource() {
        try {
            // Пытаемся получить домен родительского окна (для iframe)
            if (window.parent && window.parent !== window) {
                return window.parent.location.hostname.toLowerCase();
            }
        } catch (e) {
            // Если доступ заблокирован CORS, используем referrer
            return getReferrerHostname();
        }
        return getReferrerHostname();
    }

    // Функция для создания UTM-параметров
    function generateUTMParams() {
        const isOwnDomain = true;
        const isInIframe = false;
        const params = new URLSearchParams();
        
        params.set('utm_source', 'logo_link');
        
        if (isInIframe && isOwnDomain) {
            params.set('utm_medium', 'iframe_own');
        } else if (isInIframe) {
            params.set('utm_medium', 'iframe_external');
        } else {
            params.set('utm_medium', 'direct');
        }
    
        
        return params.toString();
    }
})();