const HOST = 'http://localhost:3000';

/* @ngInject */
const CurrentUser = ($resource) => {
  let CurrentUser = {},// $resource(HOST + '/Auth', {}),
    _currentUser = {};

  const service = {
    /**
     *
     * @param {array} table from entities table
     * @param {string} permission from restriction column , _view, _create, _edit, _delete
     * @returns {boolean} returns permission
     */
    isAllowed: (table, permission) => {
      table = table.toUpperCase();

      if (this.role_id === 2) {
        // Role 2 is administrador , has total access
        return true;
      }

      return this.restrictions &&
        this.restrictions[table] &&
        this.restrictions[table][permission] &&
        this.restrictions[table][permission] === 1;
    },

    getUser: () => {
      return _currentUser;
    },

    setUser: (currentUser) => {
      _currentUser = currentUser;
    }
  };

  return service;
};

export default CurrentUser;
