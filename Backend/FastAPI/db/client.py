from pymongo import MongoClient


# Conexion a la base de datos local
# db_client = MongoClient().local


#Conexion a la base de datos mongo atlas remota
db_client = MongoClient("mongodb+srv://calvarezmartin96:nlPj6TDXca1Fvwny@cluster0.ioyoiik.mongodb.net/").test