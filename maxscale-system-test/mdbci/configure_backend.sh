echo "script_dir cb-01 ${script_dir}"
. ${script_dir}/set_env.sh $name
echo "script_dir cb-02 ${sc2ript_dir}"
${script_dir}/backend/setup_repl.sh
echo "script_dir cb-03 ${script_dir}"
${script_dir}/backend/galera/setup_galera.sh
echo "script_dir cb-04 ${script_dir}"
${script_dir}/configure_core.sh

rm ~/vagrant_lock

