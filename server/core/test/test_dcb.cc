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

/**
 *
 * @verbatim
 * Revision History
 *
 * Date         Who                 Description
 * 05-09-2014   Martin Brampton     Initial implementation
 *
 * @endverbatim
 */

// To ensure that ss_info_assert asserts also when builing in non-debug mode.
#if !defined(SS_DEBUG)
#define SS_DEBUG
#endif
#if defined(NDEBUG)
#undef NDEBUG
#endif

#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#include <maxscale/config.h>
#include <maxscale/listener.h>

#include "../internal/messagequeue.hh"
#include "../internal/worker.hh"
#include "../dcb.cc"

/**
 * test1    Allocate a dcb and do lots of other things
 *
  */
static int
test1()
{
    DCB   *dcb;
    SERV_LISTENER dummy;
    /* Single buffer tests */
    ss_dfprintf(stderr, "testdcb : creating buffer with type DCB_ROLE_INTERNAL");
    dcb = dcb_alloc(DCB_ROLE_INTERNAL, &dummy);
    printDCB(dcb);
    ss_dfprintf(stderr, "\t..done\nAllocated dcb.");
    printAllDCBs();
    ss_dfprintf(stderr, "\t..done\n");
    dcb->state = DCB_STATE_POLLING;
    this_thread.current_dcb = dcb;
    dcb_close(dcb);
    ss_dfprintf(stderr, "Freed original dcb");
    ss_dfprintf(stderr, "\t..done\n");

    return 0;
}

int main(int argc, char **argv)
{
    int result = 1;
    MXS_CONFIG* glob_conf = config_get_global_options();
    glob_conf->n_threads = 1;
    dcb_global_init();
    if (maxscale::MessageQueue::init())
    {
        if (maxscale::Worker::init())
        {
            result = 0;
            result += test1();
            maxscale::Worker::finish();
        }
        maxscale::MessageQueue::finish();
    }

    exit(result);
}



