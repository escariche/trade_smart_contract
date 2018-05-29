Router.map(function() {
    this.route('company');
    this.route('user');
    this.route('undefined', function() {
        this.route('show', { path: '/views/undefined/index' });
    });
    this.route('owner', function() {
        this.route('show', { path: '/views/owner/index' });
    });
});

export default Router
