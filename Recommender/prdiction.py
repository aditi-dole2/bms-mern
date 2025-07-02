from flask import Flask, request, jsonify
import numpy as np
import tensorflow as tf
import keras
from sklearn.preprocessing import StandardScaler, MinMaxScaler
from helper import load_data, gen_user_vecs, print_pred_movies
import logging
import traceback

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

def l2_normalize(x):
    return tf.linalg.l2_normalize(x, axis=1)

# Initialize Flask app
app = Flask(__name__)

logger.debug("Loading trained model...")
# Load the trained model
model = keras.models.load_model('C:\\Users\\Aditi\\OneDrive\\Desktop\\Data Analysis\\software\\project\\bms_mern\\backend\\Recommender\\trained_model.h5', custom_objects={'l2_normalize': l2_normalize}, compile=False)
logger.debug("Model loaded successfully.")

logger.debug("Loading and scaling data...")
# Load and scale the data
item_train, user_train, y_train, item_features, user_features, item_vecs, movie_dict = load_data()
logger.debug(f"Data loaded: item_train shape {item_train.shape}, user_train shape {user_train.shape}, y_train shape {y_train.shape}")

num_user_features = user_train.shape[1] - 3  # remove userid, rating count and ave rating during training
num_item_features = item_train.shape[1] - 1  # remove movie id at train time
uvs, ivs, u_s, i_s = 3, 3, 3, 1  # Indices for user and item feature vectors

# Initialize and fit scalers
scalerItem = StandardScaler()
scalerItem.fit(item_train)
item_train = scalerItem.transform(item_train)

scalerUser = StandardScaler()
scalerUser.fit(user_train)
user_train = scalerUser.transform(user_train)

scalerTarget = MinMaxScaler((-1, 1))
scalerTarget.fit(y_train.reshape(-1, 1))
y_train = scalerTarget.transform(y_train.reshape(-1, 1))

default = {
    "id": 5000,
    "avg": 0.0,
    "Action": 3.4,
    "Adventure": 3.4,
    "Animation": 3.6,
    "Children": 3.4,
    "Comedy": 3.4,
    "Crime": 3.5,
    "Documentary": 3.8,
    "Drama": 3.6,
    "Fantasy": 3.4,
    "Horror": 3.2,
    "Mystery": 3.6,
    "Romance": 3.4,
    "Sci-Fi": 3.4,
    "Thriller": 3.4,
    "rating_count": 3.0
}

def movies_predict(user_vec):
    """
    Predicts the top 10 movies for a given user vector.
    """
    logger.debug(f"Generating user vectors for prediction with input: {user_vec}")
    user_vecs = gen_user_vecs(user_vec, len(item_vecs))
    suser_vecs = scalerUser.transform(user_vecs)
    sitem_vecs = scalerItem.transform(item_vecs)
    
    # Make a prediction
    y_p = model.predict([suser_vecs[:, u_s:], sitem_vecs[:, i_s:]])# type:ignore
    logger.debug(f"Raw model predictions: {y_p}")
    
    # Unscale y prediction
    y_pu = scalerTarget.inverse_transform(y_p)
    logger.debug(f"Unscaled predictions: {y_pu}")
    
    # Sort the results, highest prediction first
    sorted_index = np.argsort(-y_pu, axis=0).reshape(-1).tolist()  # Negate to get largest rating first
    sorted_ypu = y_pu[sorted_index]
    sorted_items = item_vecs[sorted_index]
    
    result = print_pred_movies(sorted_ypu, sorted_items, movie_dict, maxcount=10)
    logger.debug(f"Top predicted movies: {result}")
    return result

@app.route('/movie/predict', methods=['POST'])
def predict():
    try:
        user_data = request.get_json()
        logger.debug(f"Received prediction request data: {user_data}")
        data = list(default.values())
        keys = list(default.keys())
        
        # Update data based on user input
        for i in user_data['user_vec']:
            if i in default:
                index = keys.index(i)
                data[index] = 5
                logger.debug(f"Updated user vector index {index} ({i}) to 5")
                
        user_vec = np.array(data).reshape(1, -1)  # Ensure input is in the correct shape
        predictions = movies_predict(user_vec)  # Call the prediction function
        logger.debug(f"Predictions generated: {predictions}")
        print(predictions)
        return jsonify({"predictions": predictions})
    
    except Exception as e:
        logger.error(f"Error during prediction: {e}", exc_info=True)
        return jsonify({
            "error": str(e),
            "trace": traceback.format_exc()
        }), 500

if __name__ == '__main__':
    app.run(debug=True)

## & C:/Users/Aditi/AppData/Local/Microsoft/WindowsApps/python3.12.exe "c:/Users/Aditi/OneDrive/Desktop/Data Analysis/software/project/bms_mern/backend/Recommender/prdiction.py"