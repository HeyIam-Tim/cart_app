dump:
	ssh root@95.163.241.101 /home/gz/backup.sh
download:
	echo "Download DB dump from 95.163.241.101..."
	scp root@95.163.241.101:/home/gz/backups/db.bak ./dumps/db.bak
copy:
	echo "copy start"
	docker cp ./dumps/db.bak postgresgz:/home/db.bak
	docker cp ./update_docker.sh postgresgz:/home/
	docker exec -it postgresgz chmod +x /home/update_docker.sh
	echo "copy end"
update:
	echo "Update dump"
	docker exec postgresgz pg_restore -W --host localhost --port 5432 --username=gz --dbname gz --verbose /home/db.bak
	echo "Done."