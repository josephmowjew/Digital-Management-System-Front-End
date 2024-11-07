$(document).ready(function() {
    $('#includeSignature').change(function() {
        const $preview = $('#signaturePreview');
        const $spinner = $('<div class="spinner-border spinner-border-sm me-2" role="status"><span class="visually-hidden">Loading...</span></div>');
        
        if (this.checked) {
            $preview.html($spinner).show();
            
            fetch(`${host}/api/Users/signature/html`, {
                headers: {
                    'Authorization': `Bearer ${tokenValue}`
                }
            })
            .then(response => {
                if (!response.ok) throw new Error('Failed to fetch signature');
                return response.text();
            })
            .then(html => {
                $preview.html(html);
            })
            .catch(error => {
                $preview.html('<div class="text-danger">Failed to load signature</div>');
                console.error('Signature fetch error:', error);
            });
        } else {
            $preview.hide().html('');
        }
    });
}); 