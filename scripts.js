document.getElementById('lookup-button').addEventListener('click', fetchPincodeData);

function fetchPincodeData() {
    const pincode = document.getElementById('pincode').value;
    const errorDiv = document.getElementById('error');
    const resultDiv = document.getElementById('result');
    const loader = document.getElementById('loader');

    // Clear previous results and errors
    errorDiv.innerHTML = '';
    resultDiv.innerHTML = '';
    if (pincode.length !== 6 || isNaN(pincode)) {
        errorDiv.textContent = 'Please enter a valid 6-digit pincode.';
        return;
    }

    loader.style.display = 'block'; // Show loader
    fetch(`https://api.postalpincode.in:443/pincode/$%7Bpincode%7D`)
        .then(response => response.json())
        .then(data => {
            loader.style.display = 'none'; // Hide loader
            if (data[0].Status === 'Success') {
                displayResults(data[0].PostOffice);
            } else {
                errorDiv.textContent = 'Error fetching data. Please try again.';
            }
        })
        .catch(error => {
            loader.style.display = 'none'; // Hide loader
            errorDiv.textContent = 'An error occurred. Please try again.';
        });
}

function displayResults(postOffices) {
    const resultDiv = document.getElementById('result');
    postOffices.forEach(postOffice => {
        const div = document.createElement('div');
        div.className = 'post-office';
        div.innerHTML = `
            <strong>Post Office Name:</strong> ${postOffice.Name}<br>
            <strong>Pincode:</strong> ${postOffice.Pincode}<br>
            <strong>District:</strong> ${postOffice.District}<br>
            <strong>State:</strong> ${postOffice.State}
        `;
        resultDiv.appendChild(div);
    });

    document.getElementById('filter').addEventListener('input', filterResults);
}

function filterResults() {
    const filterValue = document.getElementById('filter').value.toLowerCase();
    const postOffices = document.querySelectorAll('.post-office');
    let hasResults = false;

    postOffices.forEach(postOffice => {
        if (postOffice.textContent.toLowerCase().includes(filterValue)) {
            postOffice.style.display = 'block';
            hasResults = true;
        } else {
            postOffice.style.display = 'none';
        }
    });

    if (!hasResults) {
        document.getElementById('result').innerHTML = 'Couldn’t find the postal data you’re looking for…';
    }
}
