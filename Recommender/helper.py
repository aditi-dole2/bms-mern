import  pickle
import numpy as np
from numpy import genfromtxt
from collections import defaultdict
import pandas as pd
import tensorflow as tf
from keras.api.models import Model
from sklearn.preprocessing import StandardScaler, MinMaxScaler
from sklearn.model_selection import train_test_split
import csv
import re
import tabulate
import logging

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

# name and year extraction
pattern = r"(.+?)\s\((\d{4})\)"

def load_data():
    logger.debug("Loading data from CSV files...")
    item_train = genfromtxt(r'C:\\Users\\Aditi\\OneDrive\\Desktop\\Data Analysis\\software\\project\\bms_mern\backend\\Recommender\\content_item_train.csv', delimiter=',')
    user_train = genfromtxt(r'C:\\Users\\Aditi\\OneDrive\\Desktop\\Data Analysis\\software\\project\\bms_mern\\backend\\Recommender\\content_user_train.csv', delimiter=',')
    y_train    = genfromtxt(r'C:\\Users\\Aditi\\OneDrive\\Desktop\\Data Analysis\\software\\project\\bms_mern\\backend\\Recommender\\content_y_train.csv', delimiter=',')
    with open(r'C:\\Users\\Aditi\\OneDrive\\Desktop\\Data Analysis\\software\\project\\bms_mern\\backend\\Recommender\\content_item_train_header.txt', newline='') as f:    #csv reader handles quoted strings better
        item_features = list(csv.reader(f))[0]
    with open(r'C:\\Users\\Aditi\\OneDrive\\Desktop\\Data Analysis\\software\\project\\bms_mern\\backend\\Recommender\\content_item_train_header.txt', newline='') as f:
        user_features = list(csv.reader(f))[0]
    item_vecs = genfromtxt(r'C:\\Users\\Aditi\\OneDrive\\Desktop\\Data Analysis\\software\\project\\bms_mern\\backend\\Recommender\\content_item_vecs.csv', delimiter=',')
       
    movie_dict = defaultdict(dict)
    count = 0
#    with open('./data/movies.csv', newline='') as csvfile:
    with open(r'C:\\Users\\Aditi\\OneDrive\\Desktop\\Data Analysis\\software\\project\\bms_mern\\backend\\Recommender\\content_movie_list.csv', newline='') as csvfile:
        reader = csv.reader(csvfile, delimiter=',', quotechar='"')
        for line in reader:
            if count == 0: 
                count +=1  #skip header
                #print(line) 
            else:
                count +=1
                movie_id = int(line[0])  
                movie_dict[movie_id]["title"] = line[1]  
                movie_dict[movie_id]["genres"] =line[2]  
    logger.debug(f"Loaded {count-1} movies into movie_dict.")
    return(item_train, user_train, y_train, item_features, user_features, item_vecs, movie_dict)



def print_pred_movies(y_p, item, movie_dict, maxcount=10):
    """ print results of prediction of a new user. inputs are expected to be in
        sorted order, unscaled. """
    logger.debug("Printing predicted movies...")
    count = 0
    movies_listed = defaultdict(int)
    # disp = [["y_p", "movie id", "rating ave", "title", "genres"]]
    disp = {}

    for i in range(0, y_p.shape[0]):
        if count == maxcount:
            break
        count += 1
        movie_id = item[i, 0].astype(int)
        if movie_id in movies_listed:
            continue
        movies_listed[movie_id] = 1
        name = movie_dict[movie_id]['title']
        name, year = re.findall(pattern, name)[0]
        disp[name] = int(year)
    logger.debug(f"Predicted movies: {disp}")
    return(disp)

def gen_user_vecs(user_vec, num_items):
    """ given a user vector return:
        user predict maxtrix to match the size of item_vecs """
    logger.debug(f"Generating user vectors for {num_items} items.")
    user_vecs = np.tile(user_vec, (num_items, 1))
    return(user_vecs)
