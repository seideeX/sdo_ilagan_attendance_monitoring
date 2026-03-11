from pyzkfp.zkfp2 import ZKFP2
import mysql.connector

class FingerprintScanner:
    def __init__(self):
        ...
        self.db = mysql.connector.connect(
            host="localhost",
            user="root",
            password="",
            database="capstone_project"
        )
        self.cursor = self.db.cursor()
