import numpy as np
import numpy.ma as ma
import pandas as pd
import tensorflow as tf
import keras
from sklearn.preprocessing import StandardScaler, MinMaxScaler
from sklearn.model_selection import train_test_split
from  helper import *
import warnings
warnings.filterwarnings('ignore')


# Load data
item_train, user_train, y_train, item_features, user_features, item_vecs, movie_dict, = load_data()

num_user_features = user_train.shape[1] - 3  # remove userid, rating count and ave rating during training
num_item_features = item_train.shape[1] - 1  # remove movie id at train time
uvs = 3  # user genre vector start
ivs = 3  # item genre vector start
u_s = 3  # start of columns to use in training, user
i_s = 1  # start of columns to use in training, items



item_train_unscaled = item_train
user_train_unscaled = user_train
y_train_unscaled    = y_train

scalerItem = StandardScaler()
scalerItem.fit(item_train)
item_train = scalerItem.transform(item_train)

scalerUser = StandardScaler()
scalerUser.fit(user_train)
user_train = scalerUser.transform(user_train)

scalerTarget = MinMaxScaler((-1, 1))
scalerTarget.fit(y_train.reshape(-1, 1))
y_train = scalerTarget.transform(y_train.reshape(-1, 1))

item_train, item_test = train_test_split(item_train, train_size=0.80, shuffle=True, random_state=1)
user_train, user_test = train_test_split(user_train, train_size=0.80, shuffle=True, random_state=1)
y_train, y_test       = train_test_split(y_train,    train_size=0.80, shuffle=True, random_state=1)





# GRADED FUNCTION: create_model
import tensorflow as tf
def l2_normalize(x):
    return tf.linalg.l2_normalize(x, axis=1)

# Define input dimensions
num_user_features = 14
num_item_features = 16
num_outputs = 32
# tf.random.set_seed(1)
# User network
user_NN = keras.models.Sequential([
    keras.layers.Dense(256, activation='relu'),
    keras.layers.Dense(128, activation='relu'),
    keras.layers.Dense(num_outputs),
])

# Item network
item_NN = keras.models.Sequential([
    keras.layers.Dense(256, activation='relu'),
    keras.layers.Dense(128, activation='relu'),
    keras.layers.Dense(num_outputs),
])

# Create the user input and process it through the user network
input_user = keras.layers.Input(shape=(num_user_features,))
vu = user_NN(input_user)
vu = keras.layers.Lambda(lambda x: tf.linalg.l2_normalize(x, axis=1), output_shape=(num_outputs,))(vu)

input_user = keras.layers.Input(shape=(num_user_features,))
vu = user_NN(input_user)
vu = keras.layers.Lambda(l2_normalize, output_shape=(num_outputs,))(vu)

# Create the item input and process it through the item network
input_item = keras.layers.Input(shape=(num_item_features,))
vm = item_NN(input_item)
vm = keras.layers.Lambda(l2_normalize, output_shape=(num_outputs,))(vm)

# Final output
output = keras.layers.Dot(axes=1)([vu, vm])

# Specify the inputs and output of the model
model = keras.Model([input_user, input_item], output)


tf.random.set_seed(1)
cost_fn = keras.losses.MeanSquaredError()
opt = keras.optimizers.Adam(learning_rate=0.01)
model.compile(optimizer= opt, loss=cost_fn) # type: ignore


tf.random.set_seed(1)
model.fit([user_train[:, u_s:], item_train[:, i_s:]], y_train, epochs=25)


import tensorflow as tf

# Assume 'model' is your trained Keras model
model.save('saved_model.h5')





