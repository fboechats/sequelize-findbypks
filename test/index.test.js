'use strict';

const chai = require('chai'),
  expect = chai.expect,
  DataTypes = require('sequelize/lib/data-types'),
  Support = require('./support');

describe(Support.getTestDialectTeaser('Model'), () => {
  beforeEach(function() {
    this.User = Support.sequelize.define('User', { username: DataTypes.STRING });

    return this.User.sync({ force: true });
  });

  describe('findByPks', () => {
    it('should get all users', function() {
      return this.User.sync({ force: true }).then(() => {
        return this.User.create({ id: 1, username: 'foo' }).then(() => {
          return this.User.create({ id: 2, username: 'bar' }).then(() => {
            return this.User.create({ id: 3, username: 'excluded' }).then(() => {
              return this.User.findByPks([1, 2]).then(users => {
                expect(users.length).to.equal(2);
                expect(users[0].username).to.equal('foo');
                expect(users[1].username).to.equal('bar');
              });
            });
          });
        });
      });
    });

    it('should not crash on an empty array', function() {
      return this.User.findByPks([]).then(users => {
        expect(users).to.eql([]);
      });
    });

    it('should not crash when receive a array with inexistents ids', function() {
      return this.User.create({ id: 3, username: 'foo' }).then(() => {
        return this.User.findByPks([1, 2]).then(users => {
          return this.User.findByPks([3]).then(users1 => {
            expect(users.length).to.equal(0);
            expect(users).to.eql([]);

            expect(users1.length).to.equal(1);
            expect(users1[0].username).to.eql('foo');
          });
        });
      });
    });

    it('should crash on empty parameters', function() {
      return expect(() => {
        this.User.findByPks();
      }).to.throw('The argument passed to findByPks must be an array of ids');
    });
  });
});
