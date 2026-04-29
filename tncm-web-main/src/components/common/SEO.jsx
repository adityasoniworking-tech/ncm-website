import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const SEO = ({ title, description, keywords, image, type = 'website' }) => {
    const location = useLocation();
    const siteName = "Nutty Choco Morsels";
    const fullTitle = title ? `${title} | ${siteName}` : siteName;
    const currentUrl = `https://nuttychocomorsels.in${location.pathname}`;

    useEffect(() => {
        // Update Title
        document.title = fullTitle;

        // Update Meta Tags
        const updateMetaTag = (property, content, attr = 'name') => {
            if (!content) return;
            let tag = document.querySelector(`meta[${attr}="${property}"]`);
            if (tag) {
                tag.setAttribute('content', content);
            } else {
                tag = document.createElement('meta');
                tag.setAttribute(attr, property);
                tag.setAttribute('content', content);
                document.head.appendChild(tag);
            }
        };

        updateMetaTag('description', description);
        updateMetaTag('keywords', keywords);

        // Open Graph / Facebook
        updateMetaTag('og:title', fullTitle, 'property');
        updateMetaTag('og:description', description, 'property');
        updateMetaTag('og:url', currentUrl, 'property');
        updateMetaTag('og:type', type, 'property');
        if (image) updateMetaTag('og:image', image, 'property');

        // Twitter
        updateMetaTag('twitter:title', fullTitle);
        updateMetaTag('twitter:description', description);
        if (image) updateMetaTag('twitter:image', image);

    }, [fullTitle, description, keywords, image, currentUrl, type]);

    return null; // This component doesn't render anything
};

export default SEO;
