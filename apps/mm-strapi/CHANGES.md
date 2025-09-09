Created staging environment via current code repository

Exported orwa production data via strapi export

Copied data export (rsync) to Staging environment (current using v4.17)

Importted production data to Staging Envirnoment

Attempted running premade upgrade utility.  Failed: required specific git configuration

Created specific git configuration and tried again.  Failed: Cannot upgrade from v4.17 to 5.23.3 (node v22.19.0) - need to be on the latest copy of v4 to use their upgrade utility


Upgrade to latest version of the v4 series (WAY harder than it sounds); required:
  - Security Audit
  - Swapping npm/node versions
  - Manually updating dependency tree
  - Generating typescript and re-running build for each update (12 hrs just for this)

Audit performed automatically as part of upgrade; discovered 47+ vulnerabilities in out-of-date libraries

Used provided tool to upgrade to latest version of Strap: v5.23.3 (node v22.19.0)

Exportted data from staging using strapi export

Copied export; Required to import data required:
  - Copying src/api
  - Copying src/components
  - Copying src/extensions
  - Copying src/plugins
  - Generating typescript and rebuilding for each operation (4hrs)

Adapting schema changes causing import errors:
  - User/Roles Extension's relationship
  - Wrapping negative lattitude/longitude values in quotation marks


Importing v5 Database


