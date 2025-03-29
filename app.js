// Sample healthcare data for fallback
const healthcareData = {
    expenditure: [
        { year: 2018, amount: 3.6 },
        { year: 2019, amount: 3.8 },
        { year: 2020, amount: 4.1 },
        { year: 2021, amount: 4.3 },
        { year: 2022, amount: 4.6 }
    ],
    diseases: [
        { name: 'Diabetes', prevalence: 10.5 },
        { name: 'Hypertension', prevalence: 32.0 },
        { name: 'Heart Disease', prevalence: 7.2 },
        { name: 'Asthma', prevalence: 7.7 }
    ],
    outcomes: [
        { metric: 'Readmission Rate', value: 15 },
        { metric: 'Patient Satisfaction', value: 82 },
        { metric: 'Average Stay (days)', value: 4.5 }
    ]
};

// Fetch healthcare data from APIs
async function fetchHealthcareData() {
    try {
        // Show loading states
        document.querySelectorAll('.loading-state').forEach(el => el.classList.remove('hidden'));
        
        const responses = await Promise.all([
            fetch('https://healthdata.gov/resource/example1.json'),
            fetch('https://data.cdc.gov/resource/example2.json')
        ]);
        
        const data = await Promise.all(responses.map(res => res.json()));
        return {
            expenditure: data[0],
            diseases: data[1],
            outcomes: data[2]
        };
    } catch (error) {
        console.error('Error fetching healthcare data:', error);
        // Show error states
        document.querySelectorAll('.error-state').forEach(el => {
            el.classList.remove('hidden');
            el.textContent = 'Failed to load data. Using sample data.';
        });
        return healthcareData; // Fallback to sample data
    }
}

// Initialize charts when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    fetchHealthcareData().then(data => {
        // Hide loading states
        document.querySelectorAll('.loading-state').forEach(el => el.classList.add('hidden'));
        
        // Render charts with fetched data
        renderExpenditureChart(data.expenditure);
        renderDiseaseChart(data.diseases);
        renderOutcomesChart(data.outcomes);
    });

    // Form submission handler
    const contactForm = document.querySelector('form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Thank you for your message! We will get back to you soon.');
            contactForm.reset();
        });
    }
});

// Function to render expenditure chart
function renderExpenditureChart(data) {
    const ctx = document.getElementById('expenditure-chart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.map(item => item.year),
            datasets: [{
                label: 'Healthcare Expenditure (Trillions $)',
                data: data.map(item => item.amount),
                borderColor: '#3b82f6',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                tension: 0.3
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                }
            }
        }
    });
}

// Function to render disease chart
function renderDiseaseChart(data) {
    const ctx = document.getElementById('diseases-chart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.map(item => item.name),
            datasets: [{
                label: 'Prevalence (%)',
                data: data.map(item => item.prevalence),
                backgroundColor: '#2563eb',
                borderColor: '#1e40af',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
}

// Function to render outcomes chart
function renderOutcomesChart(data) {
    const ctx = document.getElementById('outcomes-chart').getContext('2d');
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: data.map(item => item.metric),
            datasets: [{
                data: data.map(item => item.value),
                backgroundColor: [
                    '#3b82f6',
                    '#2563eb',
                    '#1e40af'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'right',
                }
            }
        }
    });
}
