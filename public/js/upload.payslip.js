var formData = new FormData();

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
    fileList.innerHTML = `<p class="justify-content-center">
                          <b>Click</b> to browse or <b>drag and drop</b> files here!\n
                          </p>`; // Clear previous file list

    formData = new FormData();

    Array.from(files).forEach(file => {
        formData.append('files', file);
        const listItem = document.createElement('div');
        listItem.classList.add('text-success')
        listItem.textContent = file.name;
        fileList.appendChild(listItem);
    });

}

document.getElementById('submit-btn').addEventListener('click', async (e) => {
    e.preventDefault();
    console.log(formData.getAll('files'))
    await fetch('/admin/upload/payslip', {
        method: 'POST',
        body: formData
    })
        .then(async (response) => {
            let resp = await response.json()
            alert(resp.message)
            console.log(resp)
        })
        .catch(error => console.error('Error:', error));
})