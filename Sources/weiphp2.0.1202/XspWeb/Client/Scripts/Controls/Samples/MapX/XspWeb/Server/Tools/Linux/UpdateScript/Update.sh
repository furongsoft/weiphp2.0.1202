#/bin/bash

Path=`dirname "$0"`
BackupFolder="Backup"
CurrentFolder="AntennaManagement"
NewFolder="New"
InitScript="/Init.sh"
UpdateScript="/XspWeb/Server/Tools/Linux/UpdateScript/Update.sh"

${Path}/../bin/shutdown.sh
sleep 10

rm -rf ${Path}/${BackupFolder} 2>/dev/null
rm -rf  ${Path}/${CurrentFolder} ${Path}/${BackupFolder} 2>/dev/null
mv ${Path}/${NewFolder} ${Path}/${CurrentFolder} 2>/dev/null

chmod a+x ${Path}/${CurrentFolder}${UpdateScript}
chmod a+x ${Path}/${CurrentFolder}${InitScript}
${Path}/${CurrentFolder}${InitScript}

${Path}/../bin/startup.sh
sleep 10