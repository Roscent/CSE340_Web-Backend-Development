<%- include('partials/header') %>

<main>
    <h1><%= title %></h1>
    
    <div class="users-container">
        <p>Welcome, <%= userName %>! Here are all registered users in the system:</p>
        
        <% if (users && users.length > 0) { %>
            <table class="users-table" border="1" cellpadding="10" cellspacing="0" style="border-collapse: collapse; width: 100%;">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email (Username)</th>
                        <th>Role</th>
                    </tr>
                </thead>
                <tbody>
                    <% users.forEach(user => { %>
                        <tr>
                            <td><%= user.user_id %></td>
                            <td><%= user.name %></td>
                            <td><%= user.email %></td>
                            <td>
                                <span class="role-badge role-<%= user.role_name %>">
                                    <%= user.role_name %>
                                </span>
                            </td>
                        </tr>
                    <% }); %>
                </tbody>
            </table>
        <% } else { %>
            <p>No users found in the system.</p>
        <% } %>
        
        <p style="margin-top: 30px;">
            <a href="/dashboard">← Back to Dashboard</a>
        </p>
    </div>
</main>

<%- include('partials/footer') %>