/*
 * Copyright (c) 2016 MariaDB Corporation Ab
 *
 * Use of this software is governed by the Business Source License included
 * in the LICENSE.TXT file and at www.mariadb.com/bsl11.
 *
 * Change Date: 2020-01-01
 *
 * On the date above, in accordance with the Business Source License, use
 * of this software will be governed by version 2 or later of the General
 * Public License.
 */

require('./common.js')()

exports.command = 'list <command>'
exports.desc = 'List objects'
exports.handler = function() {}
exports.builder = function(yargs) {
    yargs
        .command('servers', 'List servers', function(yargs) {
            return yargs.epilog('List all servers in MaxScale.')
                .usage('Usage: list servers')
        }, function(argv) {
            maxctrl(argv, function(host) {
                return getCollection(host, 'servers', [
                    {'Server': 'id'},
                    {'Address': 'attributes.parameters.address'},
                    {'Port': 'attributes.parameters.port'},
                    {'Connections': 'attributes.statistics.connections'},
                    {'State': 'attributes.state'}
                ])
            })
        })
        .command('services', 'List services', function(yargs) {
            return yargs.epilog('List all services and the servers they use.')
                .usage('Usage: list services')
        }, function(argv) {
            maxctrl(argv, function(host) {
                return getCollection(host, 'services',[
                    {'Service': 'id'},
                    {'Router': 'attributes.router'},
                    {'Connections': 'attributes.connections'},
                    {'Total Connections': 'attributes.total_connections'},
                    {'Servers': 'relationships.servers.data[].id'}
                ])
            })
        })
        .command('listeners <service>', 'List listeners of a service', function(yargs) {
            return yargs.epilog('List listeners for a service.')
                .usage('Usage: list listeners <service>')
        }, function(argv) {
            maxctrl(argv, function(host) {
                return getSubCollection(host, 'services/' + argv.service, 'attributes.listeners', [
                    {'Name': 'id'},
                    {'Port': 'attributes.parameters.port'},
                    {'Host': 'attributes.parameters.host'}
                ])
            })
        })
        .command('monitors', 'List monitors', function(yargs) {
            return yargs.epilog('List all monitors in MaxScale.')
                .usage('Usage: list monitors')
        }, function(argv) {
            maxctrl(argv, function(host) {
                return getCollection(host, 'monitors', [
                    {'Monitor': 'id'},
                    {'State': 'attributes.state'},
                    {'Servers': 'relationships.servers.data[].id'}
                ])
            })
        })
        .command('sessions', 'List sessions', function(yargs) {
            return yargs.epilog('List all client sessions.')
                .usage('Usage: list sessions')
        }, function(argv) {
            maxctrl(argv, function(host) {
                return getCollection(host, 'sessions',[
                    {'Id': 'id'},
                    {'Service': 'relationships.services.data[].id'},
                    {'User': 'attributes.user'},
                    {'Host': 'attributes.remote'}
                ])
            })
        })
        .command('filters', 'List filters', function(yargs) {
            return yargs.epilog('List all filters in MaxScale.')
                .usage('Usage: list filters')
        }, function(argv) {
            maxctrl(argv, function(host) {
                return getCollection(host, 'filters', [
                    {'Filter': 'id'},
                    {'Service': 'relationships.services.data[].id'},
                    {'Module': 'attributes.module'}
                ])
            })
        })
        .command('modules', 'List loaded modules', function(yargs) {
            return yargs.epilog('List all currently loaded modules.')
                .usage('Usage: list modules')
        }, function(argv) {
            maxctrl(argv, function(host) {
                return getCollection(host, 'maxscale/modules',[
                    {'Module':'id'},
                    {'Type':'attributes.module_type'},
                    {'Version': 'attributes.version'}
                ])
            })
        })
        .command('users', 'List created network users', function(yargs) {
            return yargs.epilog('List the users that can be used to connect to the MaxScale REST API.')
                .usage('Usage: list users')
        }, function(argv) {
            maxctrl(argv, function(host) {
                return getCollection(host, 'users/inet',[
                    {'Name':'id'}
                ])
            })
        })
        .command('commands', 'List module commands', function(yargs) {
            return yargs.epilog('List all available module commands.')
                .usage('Usage: list commands')
        }, function(argv) {
            maxctrl(argv, function(host) {
                return getCollection(host, 'maxscale/modules',[
                    {'Module':'id'},
                    {'Commands': 'attributes.commands[].id'}
                ])
            })
        })
        .usage('Usage: list <command>')
        .help()
        .command('*', 'the default command', {}, function(argv) {
            maxctrl(argv, function(host) {
                return error('Unknown command. See output of `help list` for a list of commands.')
            })
        })
}
