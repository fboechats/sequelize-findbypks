module.exports = {
  /**
     * Search for a many instances by its primary key._
     *
     * @param  {Array}                     param The value of the desired instance's primary key.
     * @param  {Object}                    [options] find options
     *
     * @see
     * {@link Model.findAll}    for a full explanation of options, Note that options.where is not supported.
     *
     * @returns {Promise<Array<Model>>}
     */
    findByPks(param, options) {
      if (!Array.isArray(param)) {
        throw new Error('The argument passed to findByPks must be an array of ids');
      }

      options = Object.assign({}, options);

      if (param.every(parameter => typeof parameter === 'number' || typeof parameter === 'string' || Buffer.isBuffer(parameter))) {
        options.where = {
          [this.primaryKeyAttribute]: { [Op.in]: param }
        };
      } else {
        throw new Error(`Argument passed to findByPk is invalid: ${param}`);
      }  
      
      return this.findAll(options);
    }
  }