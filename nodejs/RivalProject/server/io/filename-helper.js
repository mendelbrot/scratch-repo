const fs = require('fs');

module.exports = {
    // Ensure a file name that does not already exist
    ensureUnique(dir, filename, preferredExt) {
        // Get filename info
        const info = this.sanitize(filename);
        if(!info)
            return;
        
        // Store filename info in variables
        const root = info.filenameRoot;
        let ext = info.extension;
        
        // Use preferred extension if set
        if(typeof preferredExt === 'string' && ext !== preferredExt)
            ext = preferredExt;

        // Ensure slash between parent dir and filename
        if(!dir)
            dir = '';
        else if(!dir.endsWith('/') && !dir.endsWith('\\'))
            dir += '/';

        // Ensure dot between filename root and extension
        if(ext)
            ext = '.' + ext;
        
        // Find available filename
        let attempt = 1;
        let suffix = '';
        while(fs.existsSync(dir + root + suffix + ext)) {
            attempt++;
            suffix = '-' + attempt;
        }

        // Return filename
        return root + suffix + ext;
    },
    sanitize(filename) {
        if(typeof filename !== 'string' || !filename)
            return;

        let extIdx = filename.lastIndexOf('.');
        let root = filename;
        let ext = '';

        // If has extension
        if(extIdx > -1) {
            root = filename.substring(0, extIdx);
            ext = filename.substring(extIdx + 1).toLowerCase();
        }

        // Valid characters only
        root = root.replace(/[^a-zA-Z0-9_-]/, '_');
        ext  = ext.replace(/[^a-zA-Z0-9_-]/, '_');

        // Replace spaces
        root = root.replace(/\s/gi, "_");
        ext  = ext.replace(/\s/gi, "_");
        
        // Return sanitized filename info
        return {
            filenameRoot: root,
            extension: ext,
            filename: root + (ext ? '.' + ext : '')
        };
    }
};