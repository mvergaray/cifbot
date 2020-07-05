const HOST = 'http://localhost:3000';
const CurrentUser = function ($resource) {
  var CurrentUser = $resource(HOST + '/Auth', {});

  /**
   *
   * @param {array} table from entities table
   * @param {string} permission from restriction column , _view, _create, _edit, _delete
   * @returns {boolean} returns permission
   */
  CurrentUser.prototype.isAllowed = function (table, permission) {
    table = table.toUpperCase();

    if (this.role_id === 2) {
      // Role 2 is administrador , has total access
      return true;
    }

    return this.restrictions &&
      this.restrictions[table] &&
      this.restrictions[table][permission] &&
      this.restrictions[table][permission] === 1;
  };

  return CurrentUser;
};

CurrentUser.$inject = ['$resource'];

export default CurrentUser;
