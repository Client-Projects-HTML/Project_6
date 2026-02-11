// Dashboard Sidebar Toggle
const sidebarToggle = document.getElementById('sidebar-toggle');
const sidebar = document.getElementById('sidebar');
const sidebarOverlay = document.getElementById('sidebar-overlay');

if (sidebarToggle && sidebar && sidebarOverlay) {
    sidebarToggle.addEventListener('click', () => {
        const isRTL = document.documentElement.dir === 'rtl';
        if (isRTL) {
            sidebar.classList.toggle('rtl:translate-x-full');
            sidebar.classList.toggle('-translate-x-full');
        } else {
            sidebar.classList.toggle('-translate-x-full');
        }
        sidebarOverlay.classList.toggle('hidden');
        scheduleRouteMapResize(320);
    });

    sidebarOverlay.addEventListener('click', () => {
        const isRTL = document.documentElement.dir === 'rtl';
        if (isRTL) {
            sidebar.classList.add('rtl:translate-x-full');
            sidebar.classList.add('-translate-x-full');
        } else {
            sidebar.classList.add('-translate-x-full');
        }
        sidebarOverlay.classList.add('hidden');
        scheduleRouteMapResize(320);
    });
}

// Persistence Logic for Clients
let clients = JSON.parse(localStorage.getItem('landrix_clients')) || [
    {
        id: 1,
        company: 'Acme Corp',
        contact: 'John Doe',
        email: 'john@acmecorp.com',
        phone: '(555) 123-4567',
        status: 'Active',
        sites: 2,
        since: '2024'
    },
    {
        id: 2,
        company: 'Global Tech',
        contact: 'Sarah Miller',
        email: 'sarah@globaltech.io',
        phone: '(555) 987-6543',
        status: 'Active',
        sites: 1,
        since: '2025'
    }
];

// Persistence Logic for Contracts
let contracts = JSON.parse(localStorage.getItem('landrix_contracts')) || [
    {
        id: 'CT-883',
        client: 'Acme Corp',
        type: 'Winter Maintenance',
        period: "Nov '25 - Apr '26",
        value: 12000,
        status: 'Active'
    },
    {
        id: 'CT-003',
        client: 'Acme Corp',
        type: 'Landscaping',
        period: "Jan '26 - Jan '27",
        value: 8500,
        status: 'Active'
    },
    {
        id: 'CT-552',
        client: 'Global Tech',
        type: 'Snow Removal',
        period: "Nov '25 - Apr '26",
        value: 15000,
        status: 'Pending'
    }
];

function normalizeContractStatus(status) {
    return status === 'Pending Sig' ? 'Pending' : status;
}

contracts = contracts.map(contract => ({
    ...contract,
    status: normalizeContractStatus(contract.status)
}));

// Persistence Logic for Schedule
let jobs = JSON.parse(localStorage.getItem('landrix_jobs')) || [
    {
        id: 'JOB-101',
        client: 'Acme Corp',
        property: 'Acme Corp Headquarters',
        type: 'Lawn Maintenance',
        date: '2026-10-22',
        crew: 'Crew A',
        color: 'green'
    },
    {
        id: 'JOB-102',
        client: 'Global Tech',
        property: 'Global Tech Park',
        type: 'Snow Removal',
        date: '2026-10-23',
        crew: 'Crew B',
        color: 'blue'
    },
    {
        id: 'JOB-103',
        client: 'Westside Mall',
        property: 'Westside Shopping Center',
        type: 'Salting & De-icing',
        date: '2026-10-24',
        crew: 'Crew C',
        color: 'orange'
    }
];

// Persistence Logic for Invoices
let invoices = JSON.parse(localStorage.getItem('landrix_invoices')) || [
    {
        id: 'INV-2026-042',
        client: 'Acme Corp',
        amount: 1250,
        date: '2026-10-20',
        status: 'Unpaid'
    },
    {
        id: 'INV-2026-038',
        client: 'Acme Corp',
        amount: 850,
        date: '2026-09-20',
        status: 'Paid'
    },
    {
        id: 'INV-2026-031',
        client: 'Global Tech',
        amount: 4500,
        date: '2026-10-05',
        status: 'Paid'
    }
];

// Persistence Logic for Quotes (Bidded Jobs)
let quotes = JSON.parse(localStorage.getItem('landrix_quotes')) || [
    {
        id: 'QUO-2026-001',
        requester: 'Acme Business Park',
        contact: 'John Doe',
        type: 'Full Winter Maintenance',
        location: '123 Business Parkway',
        date: '2026-10-24',
        status: 'New'
    },
    {
        id: 'QUO-2026-002',
        requester: 'Residential Complex A',
        contact: 'Jane Smith',
        type: 'Snow Removal (One-Time)',
        location: '45 Maple Ave',
        date: '2026-10-23',
        status: 'Pending'
    }
];

function normalizeQuoteStatus(status) {
    return status === 'Pending Review' ? 'Pending' : status;
}

quotes = quotes.map(quote => ({
    ...quote,
    status: normalizeQuoteStatus(quote.status)
}));

// Persistence Logic for Client Properties
let clientProperties = JSON.parse(localStorage.getItem('landrix_client_properties')) || [
    {
        id: 1,
        name: 'Headquarters (Building A)',
        address: '123 Business Parkway, Suite 100',
        area: '2.5 Acres',
        nextService: 'Tomorrow, 9 AM',
        status: 'Active',
        services: ['Landscaping', 'Snow Removal'],
        image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=600'
    },
    {
        id: 2,
        name: 'Warehouse & Logistics',
        address: '45 Industrial Blvd',
        area: '5.0 Acres',
        nextService: 'Oct 28, 2026',
        status: 'Active',
        services: ['Snow Removal'],
        image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=600'
    }
];

// Global state for modals
let currentEditId = null;
let currentPropertyId = null;
let currentScheduleDate = new Date(2026, 9, 19); // October 19, 2026 (Monday start)
let currentClientMonth = new Date(2026, 9, 1); // October 1, 2026

// Initialize Dashboard
document.addEventListener('DOMContentLoaded', () => {
    applyResponsiveModalLayout();
    renderClients();
    renderContracts();
    renderSchedule();
    renderInvoices();
    renderQuotes();

    if (document.getElementById('map') && window.L) {
        initRouteMap();
    }
    if (window.location.pathname.includes('client.html')) {
        renderClientProperties();
    }
    if (window.location.pathname.includes('client-properties.html')) {
        renderClientPropertiesCatalog();
    }
    if (window.location.pathname.includes('client-schedule.html')) {
        renderClientScheduleList();
    }
    if (window.location.pathname.includes('client-contracts.html')) {
        renderClientQuotes();
    }
    if (window.location.pathname.includes('client-invoices.html')) {
        renderClientInvoices();
    }
});

function applyResponsiveModalLayout() {
    const modals = document.querySelectorAll('.fixed.inset-0.z-50');
    modals.forEach(modal => {
        const panelWrap = Array.from(modal.children).find(el =>
            el.classList?.contains('absolute') && !el.classList.contains('modal-overlay')
        );
        if (!panelWrap) return;

        // Keep dialogs top-aligned on small screens so footer actions remain reachable.
        panelWrap.classList.remove('top-1/2', '-translate-y-1/2');
        panelWrap.classList.add('top-4', 'sm:top-1/2', 'sm:-translate-y-1/2', 'max-h-[calc(100vh-2rem)]');

        const panel = panelWrap.firstElementChild;
        if (panel) {
            panel.classList.add('max-h-[calc(100vh-2rem)]', 'sm:max-h-[90vh]', 'overflow-y-auto');
        }
    });
}

function saveToStorage() {
    localStorage.setItem('landrix_clients', JSON.stringify(clients));
}

function saveContractsToStorage() {
    localStorage.setItem('landrix_contracts', JSON.stringify(contracts));
}

function saveJobsToStorage() {
    localStorage.setItem('landrix_jobs', JSON.stringify(jobs));
}

function saveInvoicesToStorage() {
    localStorage.setItem('landrix_invoices', JSON.stringify(invoices));
}

function savePropertiesToStorage() {
    localStorage.setItem('landrix_client_properties', JSON.stringify(clientProperties));
}

function saveQuotesToStorage() {
    localStorage.setItem('landrix_quotes', JSON.stringify(quotes));
}

function renderClients() {
    const tbody = document.getElementById('admin-clients-tbody');
    const mobileContainer = document.querySelector('.md\\:hidden.grid');

    if (tbody) {
        tbody.innerHTML = '';
        clients.forEach(client => {
            const tr = document.createElement('tr');
            tr.className = "divide-y divide-slate-100 dark:divide-slate-800";
            tr.innerHTML = `
                <td class="py-4 px-6">
                    <div class="flex items-center gap-3">
                        <div class="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600">
                            <span class="font-bold text-xs">${client.company.substring(0, 2).toUpperCase()}</span>
                        </div>
                        <div>
                            <span class="block font-bold text-slate-900 dark:text-white">${client.company}</span>
                            <span class="text-xs text-slate-500">Since ${client.since}</span>
                        </div>
                    </div>
                </td>
                <td class="py-4 px-6 text-sm text-slate-600 dark:text-slate-400">
                    <div class="flex flex-col">
                        <span>${client.email}</span>
                        <span class="text-xs">${client.phone}</span>
                    </div>
                </td>
                <td class="py-4 px-6 text-sm text-slate-600 dark:text-slate-400">${client.sites} Sites</td>
                <td class="py-4 px-6">
                    <span class="px-2 py-1 rounded ${client.status === 'Active' ? 'bg-green-50 dark:bg-green-900/20 text-green-600' : 'bg-red-50 dark:bg-red-900/20 text-red-600'} text-xs font-bold">${client.status}</span>
                </td>
                <td class="py-4 px-6 text-right flex justify-end gap-2">
                    <button onclick="openClientModalById(${client.id})" class="text-slate-400 hover:text-primary-500 transition-colors" title="Edit Client">
                        <i class="ph-bold ph-pencil-simple text-lg"></i>
                    </button>
                    <button onclick="deleteClientById(${client.id})" class="text-slate-400 hover:text-red-500 transition-colors" title="Delete Client">
                        <i class="ph-bold ph-trash text-lg"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }

    if (mobileContainer) {
        mobileContainer.innerHTML = '';
        clients.forEach(client => {
            const card = document.createElement('div');
            card.className = "bg-white dark:bg-slate-950 rounded-xl p-4 shadow-sm border border-slate-100 dark:border-slate-800";
            card.innerHTML = `
                <div class="flex items-start justify-between gap-3 mb-4">
                    <div class="flex items-center gap-3 min-w-0">
                        <div class="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600">
                            <span class="font-bold text-sm">${client.company.substring(0, 2).toUpperCase()}</span>
                        </div>
                        <div class="min-w-0">
                            <h3 class="font-bold text-slate-900 dark:text-white leading-tight break-words">${client.company}</h3>
                            <p class="text-xs text-slate-500">Since ${client.since}</p>
                        </div>
                    </div>
                    <span class="shrink-0 px-2 py-1 rounded ${client.status === 'Active' ? 'bg-green-50 dark:bg-green-900/20 text-green-600' : 'bg-red-50 dark:bg-red-900/20 text-red-600'} text-xs font-bold">${client.status}</span>
                </div>
                <div class="space-y-3 mb-4">
                    <div class="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-400 min-w-0">
                        <i class="ph-bold ph-envelope text-lg text-slate-400 mt-0.5 shrink-0"></i>
                        <span class="break-all">${client.email}</span>
                    </div>
                    <div class="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-400 min-w-0">
                        <i class="ph-bold ph-phone text-lg text-slate-400 mt-0.5 shrink-0"></i>
                        <span>${client.phone}</span>
                    </div>
                    <div class="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-400 min-w-0">
                        <i class="ph-bold ph-buildings text-lg text-slate-400 mt-0.5 shrink-0"></i>
                        <span>${client.sites} Properties Managed</span>
                    </div>
                </div>
                <div class="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row gap-3 sm:justify-between sm:items-center">
                    <button onclick="deleteClientById(${client.id})" class="w-full sm:w-auto text-slate-400 hover:text-red-500 inline-flex items-center justify-center sm:justify-start gap-1 text-sm font-bold transition-colors">
                        <i class="ph-bold ph-trash text-lg"></i>
                        <span>Delete</span>
                    </button>
                    <button onclick="openClientModalById(${client.id})"
                        class="w-full sm:w-auto inline-flex items-center justify-center sm:justify-end gap-2 text-sm font-bold text-primary-600 hover:text-primary-500">
                        <span>Manage Client</span>
                        <i class="ph-bold ph-arrow-right rtl:rotate-180"></i>
                    </button>
                </div>
            `;
            mobileContainer.appendChild(card);
        });
    }
}

// Modal Logic
function openClientModal(btn) {
    // This is for the "Add Client" button which doesn't have an ID
    openClientModalById(null);
}

function openClientModalById(id) {
    const modal = document.getElementById('client-modal');
    const title = document.getElementById('modal-title');
    const form = document.getElementById('client-form');

    if (!modal) return;
    modal.classList.remove('hidden');

    currentEditId = id;

    if (id) {
        title.textContent = 'Edit Client';
        const client = clients.find(c => c.id === id);
        if (client) {
            document.getElementById('client-company').value = client.company;
            document.getElementById('client-contact').value = client.contact;
            document.getElementById('client-email').value = client.email;
            document.getElementById('client-phone').value = client.phone;
            document.getElementById('client-status').value = client.status;
        }
    } else {
        title.textContent = 'Add New Client';
        if (form) form.reset();
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('hidden');
    }
}

function saveClient(event) {
    event.preventDefault();

    const company = document.getElementById('client-company').value;
    const contact = document.getElementById('client-contact').value;
    const email = document.getElementById('client-email').value;
    const phone = document.getElementById('client-phone').value;
    const status = document.getElementById('client-status').value;

    if (currentEditId) {
        // Update
        const index = clients.findIndex(c => c.id === currentEditId);
        if (index !== -1) {
            clients[index] = {
                ...clients[index],
                company,
                contact,
                email,
                phone,
                status
            };
        }
        window.showConfirmDialog({
            title: 'Updated!',
            message: 'Client updated successfully!',
            icon: 'ph-check-circle',
            theme: 'success',
            confirmText: 'Great',
            showCancel: false
        });
    } else {
        // Add
        const newClient = {
            id: Date.now(),
            company,
            contact,
            email,
            phone,
            status,
            sites: 0,
            since: new Date().getFullYear().toString()
        };
        clients.unshift(newClient);
        window.showConfirmDialog({
            title: 'Success!',
            message: 'New client added successfully!',
            icon: 'ph-check-circle',
            theme: 'success',
            confirmText: 'Done',
            showCancel: false
        });
    }

    saveToStorage();
    renderClients();
    closeModal('client-modal');
}

function deleteClientById(id) {
    window.showConfirmDialog({
        title: 'Delete Client',
        message: 'Are you sure you want to delete this client? This action cannot be undone and will remove all associated data.',
        icon: 'ph-trash',
        theme: 'danger',
        confirmText: 'Delete Client',
        onConfirm: () => {
            clients = clients.filter(c => c.id !== id);
            saveToStorage();
            renderClients();
        }
    });
}

// Handle Service Request Actions (from admin.html)
function approveRequest(event, btn) {
    event.preventDefault();
    window.showConfirmDialog({
        title: 'Approve Request',
        message: 'Are you sure you want to approve this service request? This will notify the client and move it to the next stage.',
        icon: 'ph-check-circle',
        theme: 'primary',
        confirmText: 'Approve',
        onConfirm: () => {
            const row = btn.closest('tr');
            if (row) {
                const statusSpan = row.querySelector('td span');
                if (statusSpan) {
                    statusSpan.className = 'px-2 py-1 rounded bg-green-50 dark:bg-green-900/20 text-green-600 text-xs font-bold';
                    statusSpan.textContent = 'Approved';
                }
            }
        }
    });
    // Close dropdown
    const dropdown = btn.closest('.relative')?.querySelector('.absolute');
    if (dropdown) dropdown.classList.add('hidden');
}

function deleteRequest(event, btn) {
    event.preventDefault();
    window.showConfirmDialog({
        title: 'Delete Request',
        message: 'Are you sure you want to delete this service request? This action cannot be reversed.',
        icon: 'ph-trash',
        theme: 'danger',
        confirmText: 'Delete Request',
        onConfirm: () => {
            const row = btn.closest('tr');
            if (row) {
                row.style.opacity = '0';
                row.style.transition = 'opacity 0.3s ease';
                setTimeout(() => {
                    row.remove();
                }, 300);
            }
        }
    });
    const dropdown = btn.closest('.relative')?.querySelector('.absolute');
    if (dropdown) dropdown.classList.add('hidden');
}

// Click outside logic
document.addEventListener('click', (event) => {
    // Dropdowns (target only registered dropdown menus, not generic absolute elements)
    const dropdowns = document.querySelectorAll('[data-dropdown-menu]');
    dropdowns.forEach(dropdown => {
        const parent = dropdown.closest('[data-dropdown]');
        if (parent && !parent.contains(event.target)) {
            dropdown.classList.add('hidden');
        }
    });

    // Modal overlays
    if (event.target.classList.contains('modal-overlay')) {
        const modal = event.target.closest('.fixed');
        if (modal) modal.classList.add('hidden');
    }
});

// Contract Management
function renderContracts() {
    const tbody = document.getElementById('admin-contracts-tbody');
    if (!tbody) return;

    tbody.innerHTML = '';
    contracts.forEach(contract => {
        const contractStatus = normalizeContractStatus(contract.status);
        const tr = document.createElement('tr');
        tr.className = "divide-y divide-slate-100 dark:divide-slate-800";
        tr.innerHTML = `
            <td class="py-4 px-6 text-sm font-mono text-slate-500">#${contract.id}</td>
            <td class="py-4 px-6 font-medium text-slate-900 dark:text-white">${contract.client}</td>
            <td class="py-4 px-6 text-sm">${contract.type}</td>
            <td class="py-4 px-6 text-sm text-slate-500">${contract.period}</td>
            <td class="py-4 px-6 text-sm font-bold">$${contract.value.toLocaleString()}</td>
            <td class="py-4 px-6">
                <span class="px-2 py-1 rounded ${contractStatus === 'Active' ? 'bg-green-50 dark:bg-green-900/20 text-green-600' : 'bg-orange-50 dark:bg-orange-900/20 text-orange-600'} text-xs font-bold">${contractStatus}</span>
            </td>
            <td class="py-4 px-6 text-right flex justify-end gap-2">
                <button onclick="viewContractById('${contract.id}')" class="text-slate-400 hover:text-primary-500 transition-colors" title="View Details">
                    <i class="ph-bold ph-eye text-lg"></i>
                </button>
                <button onclick="deleteContractById('${contract.id}')" class="text-slate-400 hover:text-red-500 transition-colors" title="Delete Contract">
                    <i class="ph-bold ph-trash text-lg"></i>
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function openContractModal() {
    const modal = document.getElementById('contract-modal');
    if (modal) {
        modal.classList.remove('hidden');
        document.getElementById('contract-form')?.reset();
    }
}

function saveContract(event) {
    event.preventDefault();
    const client = document.getElementById('contract-client').value;
    const type = document.getElementById('contract-type').value;
    const valueStr = document.getElementById('contract-value').value;
    const period = document.getElementById('contract-period').value;

    if (!type || !valueStr || !period) {
        window.showConfirmDialog({
            title: 'Missing Info',
            message: 'Please fill in all contract details.',
            icon: 'ph-warning',
            theme: 'danger',
            showCancel: false
        });
        return;
    }

    const newContract = {
        id: 'CT-' + (Math.floor(Math.random() * 900) + 100),
        client,
        type,
        period,
        value: parseFloat(valueStr),
        status: 'Active'
    };

    contracts.unshift(newContract);
    saveContractsToStorage();
    renderContracts();

    closeModal('contract-modal');
    window.showConfirmDialog({
        title: 'Contract Created',
        message: 'The new contract has been generated successfully.',
        icon: 'ph-check-circle',
        theme: 'success',
        confirmText: 'Done',
        showCancel: false
    });
}

function viewContractById(id) {
    const contract = contracts.find(c => c.id === id);
    if (!contract) return;
    const contractStatus = normalizeContractStatus(contract.status);

    const modal = document.getElementById('view-contract-modal');
    if (!modal) return;

    document.getElementById('view-ct-id').textContent = '#' + contract.id;
    document.getElementById('view-ct-client').textContent = contract.client;
    document.getElementById('view-ct-type').textContent = contract.type;
    document.getElementById('view-ct-period').textContent = contract.period;
    document.getElementById('view-ct-value').textContent = '$' + contract.value.toLocaleString();

    const statusSpan = document.getElementById('view-ct-status');
    statusSpan.textContent = contractStatus;
    statusSpan.className = `px-3 py-1.5 rounded-full text-xs font-bold ${contractStatus === 'Active' ? 'bg-green-50 dark:bg-green-900/20 text-green-600' : 'bg-orange-50 dark:bg-orange-900/20 text-orange-600'}`;

    modal.classList.remove('hidden');
}

function deleteContractById(id) {
    window.showConfirmDialog({
        title: 'Delete Contract',
        message: 'Are you sure you want to delete this contract? This action cannot be undone.',
        icon: 'ph-trash',
        theme: 'danger',
        confirmText: 'Delete Contract',
        onConfirm: () => {
            contracts = contracts.filter(c => c.id !== id);
            saveContractsToStorage();
            renderContracts();
        }
    });
}

function exportRoute() {
    window.showConfirmDialog({
        title: 'Export Active Routes',
        message: 'How would you like to export these routes for your crews?',
        icon: 'ph-file-arrow-up',
        theme: 'primary',
        confirmText: 'Download CSV',
        cancelText: 'Download PDF',
        onConfirm: () => {
            window.showConfirmDialog({
                title: 'Exporting...',
                message: 'Your CSV file is being generated and will download shortly.',
                icon: 'ph-hourglass',
                theme: 'success',
                confirmText: 'Great',
                showCancel: false
            });
        }
    });
}

// Schedule Management
function renderSchedule() {
    const grid = document.getElementById('calendar-grid');
    const title = document.getElementById('schedule-range-title');
    if (!grid || !title) return;

    const isWeek = document.getElementById('view-week').classList.contains('bg-primary-500');

    // Update Title Format
    if (isWeek) {
        const start = new Date(currentScheduleDate);
        start.setDate(start.getDate() - (start.getDay() === 0 ? 6 : start.getDay() - 1)); // Monday
        const end = new Date(start);
        end.setDate(end.getDate() + 6);

        const monthOpt = { month: 'long' };

        if (start.getMonth() === end.getMonth()) {
            title.textContent = `${start.toLocaleDateString('en-US', monthOpt)} ${start.getDate()} - ${end.getDate()}, ${end.getFullYear()}`;
        } else {
            const startShort = start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            const endShort = end.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            title.textContent = `${startShort} - ${endShort}, ${end.getFullYear()}`;
        }
    } else {
        title.textContent = currentScheduleDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    }

    grid.innerHTML = '';

    // Header
    ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].forEach(day => {
        const div = document.createElement('div');
        div.className = "bg-slate-50 dark:bg-slate-900/50 p-2 text-center text-xs font-bold text-slate-500 uppercase";
        div.textContent = day;
        grid.appendChild(div);
    });

    // Days
    const startDate = new Date(currentScheduleDate);
    if (isWeek) {
        startDate.setDate(startDate.getDate() - (startDate.getDay() === 0 ? 6 : startDate.getDay() - 1));
    } else {
        startDate.setDate(1);
        startDate.setDate(startDate.getDate() - (startDate.getDay() === 0 ? 6 : startDate.getDay() - 1));
    }

    for (let i = 0; i < (isWeek ? 7 : 42); i++) {
        const cellDate = new Date(startDate);
        cellDate.setDate(startDate.getDate() + i);

        const cell = document.createElement('div');
        const isSelectedMonth = cellDate.getMonth() === currentScheduleDate.getMonth();
        const isWeekend = cellDate.getDay() === 0 || cellDate.getDay() === 6;

        cell.className = `bg-white dark:bg-slate-950 min-h-[96px] sm:min-h-[120px] p-2 flex flex-col gap-1 ${!isSelectedMonth && !isWeek ? 'opacity-40' : ''} ${isWeekend ? 'bg-slate-50/30 dark:bg-slate-900/30' : ''}`;

        const dateSpan = document.createElement('span');
        dateSpan.className = `text-sm font-medium ${isSelectedMonth || isWeek ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`;
        dateSpan.textContent = cellDate.getDate();
        cell.appendChild(dateSpan);

        // Render Jobs for this date
        const y = cellDate.getFullYear();
        const m = String(cellDate.getMonth() + 1).padStart(2, '0');
        const d = String(cellDate.getDate()).padStart(2, '0');
        const dateStr = `${y}-${m}-${d}`;

        const dayJobs = jobs.filter(j => j.date === dateStr);

        dayJobs.forEach(job => {
            const jobDiv = document.createElement('div');
            const colorClass =
                job.color === 'green' ? 'bg-green-100 dark:bg-green-900/30 text-green-700' :
                    job.color === 'blue' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700' :
                        'bg-orange-100 dark:bg-orange-900/30 text-orange-700';

            jobDiv.className = `${colorClass} mt-1 text-[10px] sm:text-xs p-2 rounded font-medium flex flex-col gap-1 group transition-all cursor-pointer hover:shadow-md border border-transparent hover:border-white/20`;
            jobDiv.onclick = (e) => {
                if (e.target.closest('button')) return;
                viewJobDetails(job.id);
            };
            jobDiv.innerHTML = `
                <div class="flex justify-between items-start gap-1">
                    <span class="font-bold leading-tight">${job.client}</span>
                    <button onclick="deleteJobById('${job.id}')" class="opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-600 p-0.5 -mt-0.5">
                        <i class="ph-bold ph-trash"></i>
                    </button>
                </div>
                <div class="opacity-80 text-[9px] sm:text-[10px] leading-tight">
                    ${job.type} • ${job.crew}
                </div>
            `;
            cell.appendChild(jobDiv);
        });

        grid.appendChild(cell);
    }
}

function openAddJobModal() {
    const modal = document.getElementById('add-job-modal');
    if (modal) {
        modal.classList.remove('hidden');
        document.getElementById('job-form')?.reset();
    }
}

function viewJobDetails(id) {
    const job = jobs.find(j => j.id === id);
    if (!job) return;

    const modal = document.getElementById('view-job-modal');
    if (!modal) return;

    document.getElementById('view-job-title').textContent = `${job.client} - ${job.type}`;
    document.getElementById('view-job-id').textContent = `#${job.id}`;
    document.getElementById('view-job-property').textContent = job.property;
    document.getElementById('view-job-crew').textContent = job.crew;

    const jobDate = new Date(job.date + 'T12:00:00');
    document.getElementById('view-job-date').textContent = jobDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

    const iconCont = document.getElementById('view-job-icon');
    const colorClass =
        job.color === 'green' ? 'bg-green-100 text-green-600' :
            job.color === 'blue' ? 'bg-blue-100 text-blue-600' :
                'bg-orange-100 text-orange-600';
    iconCont.className = `w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${colorClass}`;

    modal.classList.remove('hidden');
}

function saveJob(event) {
    event.preventDefault();
    const property = document.getElementById('job-property').value;
    const type = document.getElementById('job-type').value;
    const date = document.getElementById('job-date').value;
    const crew = document.getElementById('job-crew').value;

    if (!date) {
        window.showConfirmDialog({
            title: 'Incomplete Info',
            message: 'Please select a date for the service job.',
            icon: 'ph-calendar-x',
            theme: 'danger',
            showCancel: false
        });
        return;
    }

    const newJob = {
        id: 'JOB-' + (Math.floor(Math.random() * 900) + 100),
        client: property.split(' ')[0], // Simple mock
        property,
        type,
        date,
        crew,
        color: type.includes('Lawn') ? 'green' : type.includes('Snow') ? 'blue' : 'orange'
    };

    jobs.push(newJob);
    saveJobsToStorage();

    // Auto-navigate to the new job's date
    const jobDateObj = new Date(date + 'T12:00:00'); // Use noon to avoid timezone slippage
    currentScheduleDate = jobDateObj;

    renderSchedule();

    closeModal('add-job-modal');
    window.showConfirmDialog({
        title: 'Job Scheduled!',
        message: `New ${type} job for ${property} has been assigned to ${crew} on ${date}.`,
        icon: 'ph-calendar-check',
        theme: 'success',
        confirmText: 'Great',
        showCancel: false
    });
}

function switchScheduleView(view) {
    const weekBtn = document.getElementById('view-week');
    const monthBtn = document.getElementById('view-month');

    if (!weekBtn || !monthBtn) return;

    if (view === 'week') {
        weekBtn.className = 'flex-1 md:flex-none px-3 py-1 bg-primary-500 text-white text-sm font-bold rounded-lg transition-all shadow-md';
        monthBtn.className = 'flex-1 md:flex-none px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-sm font-bold rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-all';
    } else {
        monthBtn.className = 'flex-1 md:flex-none px-3 py-1 bg-primary-500 text-white text-sm font-bold rounded-lg transition-all shadow-md';
        weekBtn.className = 'flex-1 md:flex-none px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-sm font-bold rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-all';
    }

    renderSchedule();
}

function deleteJobById(id) {
    window.showConfirmDialog({
        title: 'Cancel Scheduled Job',
        message: 'Are you sure you want to remove this job from the schedule? This action cannot be undone.',
        icon: 'ph-calendar-x',
        theme: 'danger',
        confirmText: 'Cancel Job',
        cancelText: 'Keep Job',
        onConfirm: () => {
            jobs = jobs.filter(j => j.id !== id);
            saveJobsToStorage();
            renderSchedule();
        }
    });
}

// Schedule State
function changeScheduleRange(delta) {
    const isWeek = document.getElementById('view-week').classList.contains('bg-primary-500');

    if (isWeek) {
        currentScheduleDate.setDate(currentScheduleDate.getDate() + (delta * 7));
    } else {
        currentScheduleDate.setMonth(currentScheduleDate.getMonth() + delta);
    }

    renderSchedule();
}

// Invoice Management
function renderInvoices() {
    const tbody = document.getElementById('admin-invoices-tbody');
    if (!tbody) return;

    tbody.innerHTML = '';
    invoices.forEach(inv => {
        const tr = document.createElement('tr');
        tr.className = "divide-y divide-slate-100 dark:divide-slate-800";
        tr.innerHTML = `
            <td class="py-4 px-6 font-medium text-slate-900 dark:text-white">${inv.id}</td>
            <td class="py-4 px-6 text-sm text-slate-600 dark:text-slate-400">${inv.client}</td>
            <td class="py-4 px-6 text-sm font-bold">$${inv.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
            <td class="py-4 px-6 text-sm text-slate-500">${new Date(inv.date + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
            <td class="py-4 px-6">
                <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${inv.status === 'Paid' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}">
                    <div class="w-1.5 h-1.5 rounded-full ${inv.status === 'Paid' ? 'bg-green-500' : 'bg-red-500'}"></div> ${inv.status}
                </span>
            </td>
            <td class="py-4 px-6 text-right flex justify-end gap-2">
                <button onclick="openInvoiceModalById('${inv.id}')" class="text-slate-400 hover:text-primary-500 transition-colors" title="Edit Invoice">
                    <i class="ph-bold ph-pencil-simple text-lg"></i>
                </button>
                <button onclick="deleteInvoiceById('${inv.id}')" class="text-slate-400 hover:text-red-500 transition-colors" title="Delete Invoice">
                    <i class="ph-bold ph-trash text-lg"></i>
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function renderClientInvoices() {
    const tbody = document.getElementById('client-invoices-tbody');
    if (!tbody) return;

    tbody.innerHTML = '';
    invoices.forEach(inv => {
        const tr = document.createElement('tr');
        const isUnpaid = inv.status === 'Unpaid';
        tr.className = `divide-y divide-slate-100 dark:divide-slate-800 ${isUnpaid ? 'bg-red-50/50 dark:bg-red-900/5' : ''}`;
        tr.innerHTML = `
            <td class="px-6 py-4 font-bold text-slate-900 dark:text-white">${inv.id}</td>
            <td class="px-6 py-4">${new Date(inv.date + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
            <td class="px-6 py-4">${inv.client === 'Acme Corp' ? 'Monthly Maintenance' : 'Service Call'}</td>
            <td class="px-6 py-4 font-bold">$${inv.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
            <td class="px-6 py-4">
                <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${inv.status === 'Paid' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}">
                    <div class="w-1.5 h-1.5 rounded-full ${inv.status === 'Paid' ? 'bg-green-500' : 'bg-red-500'}"></div> ${inv.status}
                </span>
            </td>
            <td class="px-6 py-4 text-right">
                ${isUnpaid ? `<button onclick="payInvoice('${inv.id}')" class="text-primary-600 hover:text-primary-700 font-bold text-xs mr-3">Pay Now</button>` : ''}
                <button onclick="downloadInvoicePDF('${inv.id}')" class="text-slate-400 hover:text-slate-600">
                    <i class="ph-bold ph-download-simple text-lg"></i>
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function payInvoice(id) {
    window.showConfirmDialog({
        title: 'Payment Processing',
        message: `Would you like to pay invoice ${id} using your saved payment method (....4429)?`,
        icon: 'ph-credit-card',
        theme: 'primary',
        confirmText: 'Confirm Payment',
        onConfirm: () => {
            window.showConfirmDialog({
                title: 'Payment Successful',
                message: 'Thank you! Your payment has been processed and a receipt has been sent to your email.',
                icon: 'ph-check-circle',
                theme: 'success',
                showCancel: false
            });
            const inv = invoices.find(i => i.id === id);
            if (inv) inv.status = 'Paid';
            saveInvoicesToStorage();
            renderClientInvoices();
        }
    });
}

function downloadInvoicePDF(id) {
    window.showConfirmDialog({
        title: 'Downloading Invoice',
        message: `Your invoice ${id} is being generated as a PDF.`,
        icon: 'ph-download-simple',
        theme: 'primary',
        showCancel: false,
        timer: 1500
    });
}

function openInvoiceModal() {
    openInvoiceModalById(null);
}

function openInvoiceModalById(id) {
    const modal = document.getElementById('invoice-modal');
    const title = document.getElementById('invoice-modal-title');
    if (!modal) return;

    modal.classList.remove('hidden');
    currentEditId = id;

    if (id) {
        title.textContent = 'Edit Invoice';
        const inv = invoices.find(i => i.id === id);
        if (inv) {
            document.getElementById('invoice-client').value = inv.client;
            document.getElementById('invoice-amount').value = inv.amount;
            document.getElementById('invoice-date').value = inv.date;
            document.getElementById('invoice-status').value = inv.status;
        }
    } else {
        title.textContent = 'Create New Invoice';
        document.getElementById('invoice-form')?.reset();
    }
}

function saveInvoice(event) {
    event.preventDefault();
    const client = document.getElementById('invoice-client').value;
    const amountStr = document.getElementById('invoice-amount').value;
    const date = document.getElementById('invoice-date').value;
    const status = document.getElementById('invoice-status').value;

    if (!client || !amountStr || !date) {
        window.showConfirmDialog({
            title: 'Missing Details',
            message: 'Please fill in all invoice information.',
            icon: 'ph-warning',
            theme: 'danger',
            showCancel: false
        });
        return;
    }

    if (currentEditId) {
        const index = invoices.findIndex(i => i.id === currentEditId);
        if (index !== -1) {
            invoices[index] = {
                ...invoices[index],
                client,
                amount: parseFloat(amountStr),
                date,
                status
            };
        }
    } else {
        const newInvoice = {
            id: 'INV-' + new Date().getFullYear() + '-' + (Math.floor(Math.random() * 900) + 100).toString().padStart(3, '0'),
            client,
            amount: parseFloat(amountStr),
            date,
            status
        };
        invoices.unshift(newInvoice);
    }

    saveInvoicesToStorage();
    renderInvoices();
    closeModal('invoice-modal');

    window.showConfirmDialog({
        title: currentEditId ? 'Invoice Updated' : 'Invoice Created',
        message: currentEditId ? 'Invoice changes saved successfully.' : 'New invoice has been generated.',
        icon: 'ph-check-circle',
        theme: 'success',
        confirmText: 'Great',
        showCancel: false
    });
}

function deleteInvoiceById(id) {
    window.showConfirmDialog({
        title: 'Delete Invoice',
        message: 'Are you sure you want to delete this invoice? This action cannot be reversed.',
        icon: 'ph-trash',
        theme: 'danger',
        confirmText: 'Delete Invoice',
        onConfirm: () => {
            invoices = invoices.filter(i => i.id !== id);
            saveInvoicesToStorage();
            renderInvoices();
        }
    });
}

// Quote Management
function renderQuotes() {
    const tbody = document.getElementById('admin-quotes-tbody');
    if (!tbody) return;

    tbody.innerHTML = '';
    quotes.forEach(quo => {
        const quoteStatus = normalizeQuoteStatus(quo.status);
        const tr = document.createElement('tr');
        tr.className = "divide-y divide-slate-100 dark:divide-slate-800";
        tr.innerHTML = `
            <td class="py-4 px-6 font-medium text-slate-900 dark:text-white">
                ${quo.requester}
                <span class="block text-xs font-normal text-slate-500">${quo.contact}</span>
            </td>
            <td class="py-4 px-6 text-sm text-slate-600 dark:text-slate-400">${quo.type}</td>
            <td class="py-4 px-6 text-sm text-slate-600 dark:text-slate-400">${quo.location}</td>
            <td class="py-4 px-6 text-sm text-slate-500">${new Date(quo.date + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
            <td class="py-4 px-6">
                <span class="px-2 py-1 rounded text-xs font-bold ${quoteStatus === 'New' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600' : 'bg-orange-50 dark:bg-orange-900/20 text-orange-600'}">
                    ${quoteStatus}
                </span>
            </td>
            <td class="py-4 px-6 text-right flex justify-end gap-2">
                <button onclick="openQuoteModalById('${quo.id}')" class="text-slate-400 hover:text-primary-500 transition-colors" title="Edit Quote">
                    <i class="ph-bold ph-pencil-simple text-lg"></i>
                </button>
                <button onclick="deleteQuoteById('${quo.id}')" class="text-slate-400 hover:text-red-500 transition-colors" title="Delete Quote">
                    <i class="ph-bold ph-trash text-lg"></i>
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function openQuoteModal() {
    openQuoteModalById(null);
}

function openQuoteModalById(id) {
    const modal = document.getElementById('quote-modal');
    const title = document.getElementById('quote-modal-title');
    if (!modal) return;

    modal.classList.remove('hidden');
    currentEditId = id;

    if (id) {
        title.textContent = 'Edit Quote Request';
        const quo = quotes.find(q => q.id === id);
        if (quo) {
            document.getElementById('quote-requester').value = quo.requester;
            document.getElementById('quote-contact').value = quo.contact;
            document.getElementById('quote-type').value = quo.type;
            document.getElementById('quote-location').value = quo.location;
            document.getElementById('quote-date').value = quo.date;
            document.getElementById('quote-status').value = normalizeQuoteStatus(quo.status);
        }
    } else {
        title.textContent = 'Create New Quote';
        document.getElementById('quote-form')?.reset();
    }
}

function saveQuote(event) {
    event.preventDefault();
    const requester = document.getElementById('quote-requester').value;
    const contact = document.getElementById('quote-contact').value;
    const type = document.getElementById('quote-type').value;
    const location = document.getElementById('quote-location').value;
    const date = document.getElementById('quote-date').value;
    const status = normalizeQuoteStatus(document.getElementById('quote-status').value);

    if (!requester || !contact || !type || !location || !date) {
        window.showConfirmDialog({
            title: 'Incomplete Request',
            message: 'Please fill in all details before saving.',
            icon: 'ph-warning',
            theme: 'danger',
            showCancel: false
        });
        return;
    }

    if (currentEditId) {
        const index = quotes.findIndex(q => q.id === currentEditId);
        if (index !== -1) {
            quotes[index] = {
                ...quotes[index],
                requester,
                contact,
                type,
                location,
                date,
                status
            };
        }
    } else {
        const newQuote = {
            id: 'QUO-' + new Date().getFullYear() + '-' + (Math.floor(Math.random() * 900) + 100).toString().padStart(3, '0'),
            requester,
            contact,
            type,
            location,
            date,
            status
        };
        quotes.unshift(newQuote);
    }

    saveQuotesToStorage();
    if (window.location.pathname.includes('client-contracts.html')) {
        renderClientQuotes();
    } else {
        renderQuotes();
    }
    closeModal('quote-modal');

    window.showConfirmDialog({
        title: currentEditId ? 'Quote Updated' : 'Quote Created',
        message: currentEditId ? 'The request has been updated.' : 'A new quote request has been manually added.',
        icon: 'ph-check-circle',
        theme: 'success',
        confirmText: 'Done',
        showCancel: false
    });
}

function deleteQuoteById(id) {
    window.showConfirmDialog({
        title: 'Delete Request',
        message: 'Are you sure you want to remove this quote request?',
        icon: 'ph-trash',
        theme: 'danger',
        confirmText: 'Delete',
        onConfirm: () => {
            quotes = quotes.filter(q => q.id !== id);
            saveQuotesToStorage();
            if (window.location.pathname.includes('client-contracts.html')) {
                renderClientQuotes();
            } else {
                renderQuotes();
            }
        }
    });
}

function downloadContractPDF(id) {
    window.showConfirmDialog({
        title: 'Contract Download',
        message: `Your signed agreement (${id}) is being prepared. It will include all service level agreements and terms.`,
        icon: 'ph-file-pdf',
        theme: 'primary',
        confirmText: 'Download Now',
        onConfirm: () => {
            window.showConfirmDialog({
                title: 'Success',
                message: 'Your contract PDF has been downloaded.',
                icon: 'ph-check-circle',
                theme: 'success',
                showCancel: false
            });
        }
    });
}

function viewContractTerms() {
    window.showConfirmDialog({
        title: 'Agreement Terms',
        message: 'This contract includes 24/7 emergency response, organic fertilization, and bi-weekly site inspections. Standard liability terms apply.',
        icon: 'ph-scroll',
        theme: 'primary',
        confirmText: 'I Understand',
        showCancel: false
    });
}

function renderClientQuotes() {
    const tbody = document.getElementById('client-quotes-tbody');
    if (!tbody) return;

    tbody.innerHTML = '';
    quotes.forEach(quo => {
        const quoteStatus = normalizeQuoteStatus(quo.status);
        const tr = document.createElement('tr');
        tr.className = "divide-y divide-slate-100 dark:divide-slate-800";
        tr.innerHTML = `
            <td class="py-4 px-6 font-medium text-slate-900 dark:text-white">
                ${quo.requester}
                <span class="block text-xs font-normal text-slate-500">${quo.contact}</span>
            </td>
            <td class="py-4 px-6 text-sm text-slate-600 dark:text-slate-400">${quo.type}</td>
            <td class="py-4 px-6 text-sm text-slate-600 dark:text-slate-400">${quo.location}</td>
            <td class="py-4 px-6 text-sm text-slate-500">${new Date(quo.date + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
            <td class="py-4 px-6">
                <span class="px-2 py-1 rounded text-xs font-bold ${quoteStatus === 'New' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600' : 'bg-orange-50 dark:bg-orange-900/20 text-orange-600'}">
                    ${quoteStatus}
                </span>
            </td>
            <td class="py-4 px-6 text-right flex justify-end gap-2">
                <button onclick="openQuoteModalById('${quo.id}')" class="text-slate-400 hover:text-primary-500 transition-colors" title="Edit Quote">
                    <i class="ph-bold ph-pencil-simple text-lg"></i>
                </button>
                <button onclick="deleteQuoteById('${quo.id}')" class="text-slate-400 hover:text-red-500 transition-colors" title="Delete Quote">
                    <i class="ph-bold ph-trash text-lg"></i>
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Route Planner Map
let routeMap = null;

function scheduleRouteMapResize(delay = 0) {
    if (!routeMap) return;
    setTimeout(() => {
        if (routeMap) {
            routeMap.invalidateSize();
        }
    }, delay);
}

function initRouteMap() {
    const mapContainer = document.getElementById('map');
    if (!mapContainer || !window.L) return;
    const isDark = document.documentElement.classList.contains('dark');
    mapContainer.classList.toggle('map-theme-dark', isDark);
    mapContainer.classList.toggle('map-theme-light', !isDark);

    // Destroy existing map if it exists to prevent duplicates
    if (routeMap) {
        routeMap.remove();
    }

    // Use a center point (e.g., Minneapolis as it's a winter city)
    routeMap = L.map('map').setView([44.9778, -93.2650], 13);

    // Dark mode tiles vs Light mode tiles
    const tileUrl = isDark
        ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
        : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

    L.tileLayer(tileUrl, {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(routeMap);

    // Add Mock Crew Markers
    L.marker([44.9810, -93.2700]).addTo(routeMap)
        .bindPopup('<b>Crew A</b><br>Stationary at Acme Corp Bldg A');

    L.marker([44.9700, -93.2500]).addTo(routeMap)
        .bindPopup('<b>Crew B</b><br>In Transit to Global Tech');

    // HQ Marker
    L.circle([44.9778, -93.2650], {
        color: '#10b981',
        fillColor: '#10b981',
        fillOpacity: 0.5,
        radius: 200
    }).addTo(routeMap).bindPopup('Landrix Headquarters');

    // Force resize on load to fix container issues
    setTimeout(() => {
        routeMap.invalidateSize();
    }, 400);
}

// Listen for theme changes from main.js
window.addEventListener('themeChanged', () => {
    if (document.getElementById('map') && window.L) {
        initRouteMap();
    }
});

window.addEventListener('resize', () => {
    scheduleRouteMapResize(120);
});

document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
        scheduleRouteMapResize(120);
    }
});

// Client Dashboard Actions
function requestService() {
    const modal = document.getElementById('request-service-modal');
    if (modal) modal.classList.remove('hidden');
}

function submitServiceRequest() {
    const property = document.querySelector('#request-service-modal select')?.value || 'Headquarters';
    const type = document.querySelectorAll('#request-service-modal select')[1]?.value || 'Emergency Service';
    const notes = document.querySelector('#request-service-modal textarea')?.value || '';

    const newQuote = {
        id: 'QUO-' + new Date().getFullYear() + '-' + (Math.floor(Math.random() * 900) + 100).toString().padStart(3, '0'),
        requester: 'Acme Corp',
        contact: 'Admin User',
        type: type,
        location: property,
        date: new Date().toISOString().split('T')[0],
        status: 'New'
    };

    quotes.unshift(newQuote);
    saveQuotesToStorage();

    window.showConfirmDialog({
        title: 'Request Sent',
        message: 'Your service request has been transmitted to our dispatch team. You will receive a notification once its scheduled.',
        icon: 'ph-paper-plane-tilt',
        theme: 'success',
        confirmText: 'Got it',
        showCancel: false,
        onConfirm: () => {
            closeModal('request-service-modal');
            if (window.location.pathname.includes('client-contracts.html')) {
                renderClientQuotes();
            }
        }
    });
}

function viewServiceDetails() {
    const modal = document.getElementById('service-details-modal');
    if (modal) modal.classList.remove('hidden');
}

function rescheduleService() {
    window.showConfirmDialog({
        title: 'Request Reschedule',
        message: 'Would you like to request a change for this service window? Our team will contact you to confirm the new time.',
        icon: 'ph-calendar-plus',
        theme: 'primary',
        confirmText: 'Request Change',
        onConfirm: () => {
            window.showConfirmDialog({
                title: 'Sent',
                message: 'Your reschedule request has been received.',
                icon: 'ph-check-circle',
                theme: 'success',
                showCancel: false
            });
        }
    });
}

function addProperty() {
    const modal = document.getElementById('add-property-modal');
    if (modal) modal.classList.remove('hidden');
}

function submitNewProperty() {
    const name = document.getElementById('prop-name-input')?.value;
    const address = document.getElementById('prop-address-input')?.value;
    const type = document.getElementById('prop-type-input')?.value;
    const area = document.getElementById('prop-area-input')?.value;

    if (!name || !address) {
        window.showConfirmDialog({
            title: 'Missing Info',
            message: 'Please provide at least a name and address for the property.',
            icon: 'ph-warning',
            theme: 'danger',
            showCancel: false
        });
        return;
    }

    const newProp = {
        id: Date.now(),
        name,
        address,
        area: area + ' Sq Ft',
        nextService: 'Pending Survey',
        status: 'Pending',
        services: [type === 'Commercial' ? 'Landscaping' : 'Snow Removal'],
        image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=600'
    };

    clientProperties.unshift(newProp);
    savePropertiesToStorage();

    if (window.location.pathname.includes('client.html')) renderClientProperties();
    if (window.location.pathname.includes('client-properties.html')) renderClientPropertiesCatalog();

    window.showConfirmDialog({
        title: 'Property Registered!',
        message: 'Your new property has been added to the system. Our team will perform a site survey within 48 hours to activate services.',
        icon: 'ph-check-circle',
        theme: 'success',
        confirmText: 'Great',
        showCancel: false,
        onConfirm: () => {
            closeModal('add-property-modal');
            document.getElementById('add-property-form')?.reset();
        }
    });
}

function renderClientProperties() {
    const container = document.getElementById('properties-container');
    if (!container) return;

    container.innerHTML = '';
    clientProperties.forEach(prop => {
        const div = document.createElement('div');
        div.className = "p-4 sm:p-6 flex items-start gap-3 sm:gap-4";
        div.innerHTML = `
            <div class="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-slate-100 dark:bg-slate-900 overflow-hidden flex-shrink-0">
                <img src="${prop.image}" class="w-full h-full object-cover">
            </div>
            <div class="flex-1 min-w-0">
                <h4 class="font-bold text-slate-900 dark:text-white break-words">${prop.name}</h4>
                <p class="text-sm text-slate-500 dark:text-slate-400 mb-2 break-words">${prop.address}</p>
                <div class="flex flex-wrap gap-2 pr-1">
                    ${prop.services.map(s => `
                        <span class="px-2 py-1 rounded ${s === 'Landscaping' ? 'bg-green-50 dark:bg-green-900/20 text-green-600' : 'bg-blue-50 dark:bg-blue-900/20 text-blue-600'} text-xs font-bold">${s} Active</span>
                    `).join('')}
                    ${prop.status === 'Pending' ? '<span class="px-2 py-1 rounded bg-orange-50 dark:bg-orange-900/20 text-orange-600 text-xs font-bold">Survey Pending</span>' : ''}
                </div>
            </div>
            <button onclick="viewPropertyDetails(${prop.id})" class="p-2 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-lg text-slate-400 shrink-0 self-start">
                <i class="ph-bold ph-caret-right"></i>
            </button>
        `;
        container.appendChild(div);
    });
}

function renderClientPropertiesCatalog() {
    const container = document.getElementById('properties-catalog-container');
    if (!container) return;

    container.innerHTML = '';
    clientProperties.forEach(prop => {
        const div = document.createElement('div');
        div.className = "bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden group hover:shadow-lg transition-all";
        div.innerHTML = `
            <div class="h-48 relative overflow-hidden">
                <img src="${prop.image}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
                <div class="absolute top-4 right-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold ${prop.status === 'Active' ? 'text-green-600' : 'text-orange-600'} shadow-sm">
                    ${prop.status}
                </div>
            </div>
            <div class="p-6">
                <h3 class="font-bold text-lg text-slate-900 dark:text-white mb-1">${prop.name}</h3>
                <p class="text-slate-500 text-sm mb-4"><i class="ph-bold ph-map-pin mr-1"></i> ${prop.address}</p>

                <div class="space-y-3 mb-6">
                    <div class="flex items-center justify-between text-sm">
                        <span class="text-slate-500">Total Area</span>
                        <span class="font-bold text-slate-900 dark:text-white">${prop.area}</span>
                    </div>
                    <div class="flex items-center justify-between text-sm">
                        <span class="text-slate-500">Next Service</span>
                        <span class="font-bold ${prop.nextService.includes('Tomorrow') ? 'text-primary-600' : 'text-slate-900 dark:text-white'}">${prop.nextService}</span>
                    </div>
                </div>

                <div class="flex gap-2">
                    ${prop.services.map(s => `
                        <span class="px-2 py-1 rounded ${s === 'Landscaping' ? 'bg-green-50 dark:bg-green-900/20 text-green-600' : 'bg-blue-50 dark:bg-blue-900/20 text-blue-600'} text-xs font-bold">${s}</span>
                    `).join('')}
                </div>

                <div class="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex gap-3">
                    <button onclick="viewPropertyDetails(${prop.id})" class="flex-1 btn border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-sm py-2">Details</button>
                    <button onclick="requestService()" class="flex-1 btn btn-primary border border-primary-600 dark:border-primary-500 text-sm py-2">Request Service</button>
                </div>
            </div>
        `;
        container.appendChild(div);
    });

}

function viewPropertyDetails(id) {
    const prop = clientProperties.find(p => p.id === id);
    if (!prop) return;

    currentPropertyId = id;
    const modal = document.getElementById('property-details-modal');
    const title = document.getElementById('prop-detail-name');
    if (modal && title) {
        title.textContent = prop.name;
        modal.classList.remove('hidden');
    }
}

function deleteProperty() {
    if (!currentPropertyId) return;

    window.showConfirmDialog({
        title: 'Delete Property?',
        message: 'Are you sure you want to remove this property from your portfolio? This action will cancel all future scheduled services.',
        icon: 'ph-trash',
        theme: 'danger',
        confirmText: 'Yes, Delete',
        onConfirm: () => {
            clientProperties = clientProperties.filter(p => p.id !== currentPropertyId);
            savePropertiesToStorage();

            if (window.location.pathname.includes('client.html')) renderClientProperties();
            if (window.location.pathname.includes('client-properties.html')) renderClientPropertiesCatalog();

            closeModal('property-details-modal');

            window.showConfirmDialog({
                title: 'Property Removed',
                message: 'The property has been successfully deleted.',
                icon: 'ph-check-circle',
                theme: 'success',
                showCancel: false
            });
        }
    });
}

function viewPropertyInvoices() {
    window.location.href = 'client-invoices.html';
}

function requestAudit() {
    window.showConfirmDialog({
        title: 'Audit Requested',
        message: 'A site audit request has been sent for this property. Our area manager will perform a visual inspection and provide a status report.',
        icon: 'ph-clipboard-text',
        theme: 'primary',
        confirmText: 'Excellent',
        showCancel: false
    });
}

function changeClientScheduleRange(delta) {
    currentClientMonth.setMonth(currentClientMonth.getMonth() + delta);
    renderClientScheduleList();
}

function renderClientScheduleList() {
    const container = document.getElementById('client-schedule-container');
    const monthTitle = document.getElementById('client-schedule-month');
    const countText = document.getElementById('client-schedule-count');

    if (!container || !monthTitle) return;

    // Update Header
    const monthName = currentClientMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    monthTitle.textContent = monthName;

    // Filter jobs for this month (Simplified to show patterns)
    // In a real app, we'd filter actual jobs data
    const monthKey = `${currentClientMonth.getFullYear()}-${String(currentClientMonth.getMonth() + 1).padStart(2, '0')}`;

    // For demo purposes, we'll generate some consistent data if jobs don't exist for the month
    const displayJobs = jobs.filter(j => j.date.startsWith(monthKey));

    if (countText) {
        countText.textContent = `${displayJobs.length} Upcoming Services`;
    }

    if (displayJobs.length === 0) {
        container.innerHTML = `
            <div class="p-12 text-center">
                <div class="w-16 h-16 bg-slate-100 dark:bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                    <i class="ph-bold ph-calendar-x text-3xl"></i>
                </div>
                <h4 class="font-bold text-slate-900 dark:text-white mb-1">No Services Scheduled</h4>
                <p class="text-slate-500 text-sm">There are no services currently planned for this month.</p>
            </div>
        `;
        return;
    }

    container.innerHTML = '';
    displayJobs.forEach(job => {
        const jobDate = new Date(job.date + 'T12:00:00');
        const day = jobDate.getDate();
        const dayName = jobDate.toLocaleDateString('en-US', { weekday: 'short' });
        const monthShort = jobDate.toLocaleDateString('en-US', { month: 'short' });

        const isPast = jobDate < new Date();
        const isTomorrow = new Date(job.date).toDateString() === new Date(Date.now() + 86400000).toDateString();

        const div = document.createElement('div');
        div.className = `flex flex-col md:flex-row gap-4 sm:gap-6 p-4 sm:p-6 rounded-2xl ${isTomorrow ? 'bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800' : 'bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800'} relative z-0 ${isPast ? 'opacity-75' : ''}`;

        div.innerHTML = `
            <div class="flex-shrink-0 text-center md:text-left md:min-w-[80px]">
                ${isPast ? '<p class="text-sm font-bold text-slate-400 uppercase">PAST</p>' : ''}
                ${isTomorrow ? '<p class="text-sm font-bold text-primary-600 uppercase">TOMORROW</p>' : ''}
                <h4 class="text-3xl font-display font-bold ${isPast ? 'text-slate-500' : 'text-slate-900 dark:text-white'}">${day}</h4>
                <p class="text-sm text-slate-500">${monthShort}, ${dayName}</p>
            </div>
            <div class="flex-1 min-w-0">
                <div class="flex items-start justify-between mb-2">
                    <h4 class="font-bold text-lg break-words ${isPast ? 'text-slate-500' : 'text-slate-900 dark:text-white'}">${job.type}</h4>
                    <span class="shrink-0 px-3 py-1 ${job.color === 'blue' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700' : job.color === 'green' ? 'bg-green-100 dark:bg-green-900/30 text-green-700' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'} text-xs font-bold rounded-full">
                        ${isPast ? 'Completed' : (job.color === 'blue' ? 'Confirmed' : 'Scheduled')}
                    </span>
                </div>
                <p class="${isPast ? 'text-slate-500' : 'text-slate-600 dark:text-slate-400'} text-sm mb-4 break-words">
                    <i class="ph-bold ${isPast ? 'ph-check-circle' : 'ph-clock'} mr-1"></i> 
                    ${isPast ? job.property : `9:00 AM - 11:30 AM &bull; ${job.property}`}
                </p>
                ${!isPast ? `
                <div class="flex items-center gap-3">
                    <div class="flex -space-x-2">
                        <img src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=100" class="w-8 h-8 rounded-full border-2 border-white dark:border-slate-900">
                        <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100" class="w-8 h-8 rounded-full border-2 border-white dark:border-slate-900">
                    </div>
                    <span class="text-xs text-slate-500">Assigned Team</span>
                </div>` : ''}
            </div>
            <div class="flex flex-col gap-2 justify-center w-full md:w-auto">
                ${isPast ?
                `<button onclick="viewServiceReport('REPORT-${job.id}')" class="text-primary-600 text-sm font-bold hover:underline">View Report</button>` :
                `<button onclick="rescheduleService()" class="btn w-full md:w-auto border border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800 text-sm py-2">Reschedule</button>`
            }
            </div>
        `;
        container.appendChild(div);
    });
}

// Support Actions
function contactSupport() {
    window.showConfirmDialog({
        title: 'Contact Support',
        message: 'Our 24/7 support line is available at +1 (555) 123-4567. You can also reach us at support@landrix.com.',
        icon: 'ph-headset',
        theme: 'primary',
        confirmText: 'Got it',
        showCancel: false
    });
}

console.log('Dashboard JS Loaded with Persistence');
