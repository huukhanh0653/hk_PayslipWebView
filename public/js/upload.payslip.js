document.getElementById('fileInput').addEventListener('change', handleFileSelect);
const uploadContainer = document.getElementById('uploadContainer');

// Drag and drop events
uploadContainer.addEventListener('dragover', (e) => {
    e.preventDefault();
    e.stopPropagation();
    uploadContainer.classList.add('dragover');
});

uploadContainer.addEventListener('dragleave', (e) => {
    e.preventDefault();
    e.stopPropagation();
    uploadContainer.classList.remove('dragover');
});

uploadContainer.addEventListener('drop', (e) => {
    e.preventDefault();
    e.stopPropagation();
    uploadContainer.classList.remove('dragover');
    handleFileSelect(e);
});

function handleFileSelect(event) {
    let files;
    if (event.type === 'drop') {
        files = event.dataTransfer.files;
    } else {
        files = event.target.files;
    }

    const fileList = document.getElementById('fileList');
    fileList.innerHTML = ''; // Clear previous file list

    const formData = new FormData();
    Array.from(files).forEach(file => {
        formData.append('files', file);
    });

    fetch('/admin/upload/payslip', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
        .then(response => response.json())
        .catch(error => console.error('Error:', error));
}