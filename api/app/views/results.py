from flask import jsonify, request, flash, redirect, url_for, send_from_directory, current_app, Response
from app import db, avatars
from app.models import Result
from app.views import bp
import os
from os.path import join, dirname, realpath
from werkzeug.utils import secure_filename
from io import BytesIO
from flask import send_file
import base64
import numpy as np
from plantcv import plantcv as pcv
import json
from PIL import Image
from io import BytesIO

# TODO add allowed extensions


def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in current_app.config['ALLOWED_EXTENSIONS']


@bp.route('/upload', methods=['POST'])
def upload():
    # request uploaded file from request object
    if 'photo' not in request.files:
        return "No file part!", 400
    file = request.files['photo']
    if file.filename == '':
        return "No selected file!", 400
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        mimetype = file.mimetype
        image = Image.open(file)
        MAX_SIZE = (200, 200)
        image.thumbnail(MAX_SIZE)
        image.save(os.path.join(
            current_app.config['AVATARS_SAVE_PATH'], filename))
        # get color values from image data
        hm, hcm, hcs = read_image_data(filename)
        # send to db
        newFile = Result(name=filename, type=mimetype, img=file.read(),
                         hue_circular_mean=hcm, hue_circular_std=hcs, hue_median=hm)
        db.session.add(newFile)
        db.session.commit()
        return jsonify(newFile.id)


@bp.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(current_app.config['AVATARS_SAVE_PATH'],
                               filename)


def read_image_data(avatar_filename):
    # Read image
    img, path, filename = pcv.readimage(os.path.join(
        current_app.config['AVATARS_SAVE_PATH'], avatar_filename))

    mask, masked_img = pcv.threshold.custom_range(
        img=img, lower_thresh=[25, 0, 0], upper_thresh=[75, 255, 255], channel='HSV')

    binary_img = pcv.median_blur(gray_img=mask, ksize=10)

    mask2 = pcv.fill(bin_img=binary_img, size=200)

    # Identify objects
    id_objects, obj_hierarchy = pcv.find_objects(img, mask2)

    # Get size of image
    h, w, c = img.shape

    # Define ROI
    roi1, roi_hierarchy = pcv.roi.rectangle(
        img=img, x=0, y=h/8*3, h=h/4, w=w)

    # Decide which objects to keep
    roi_objects, hierarchy3, kept_mask, obj_area = pcv.roi_objects(img=img, roi_contour=roi1,
                                                                   roi_hierarchy=roi_hierarchy,
                                                                   object_contour=id_objects,
                                                                   obj_hierarchy=obj_hierarchy,
                                                                   roi_type='partial')

    # Object combine kept objects
    obj, mask2 = pcv.object_composition(
        img=img, contours=roi_objects, hierarchy=hierarchy3)

    # Determine color properties: Histograms, Color Slices, output color analyzed histogram (optional)
    color_histogram = pcv.analyze_color(
        rgb_img=img, mask=mask2, colorspaces="all", label="default")

    # color_histogram.save(os.path.join(UPLOAD_FOLDER, 'histogram'))

    # Access data stored out from analyze_color
    print(pcv.outputs.observations['default']
          ['hue_circular_mean']['value'])

    hcm = pcv.outputs.observations['default']['hue_circular_mean']['value']

    # Access data stored out from analyze_color
    print(pcv.outputs.observations['default']['hue_circular_std']['value'])

    hcs = pcv.outputs.observations['default']['hue_circular_std']['value']

    # Access data stored out from analyze_color
    print(pcv.outputs.observations['default']['hue_median']['value'])

    hm = pcv.outputs.observations['default']['hue_median']['value']

    # # TODO Write shape data to results file/db
    # pcv.outputs.save_results(
    #     filename=os.path.join(TMP_FOLDER, 'results.json'))

    return hm, hcm, hcs


@bp.route('/avatars/<path:filename>')
def get_avatar(filename):
    return send_from_directory(current_app.config['AVATARS_SAVE_PATH'], filename)


@bp.route('/images/<int:id>')
def get_image(id):
    img = Result.query.filter_by(id=id).first()
    if not img:
        return 'No img found', 404

    return Response(img.img, mimetype=img.type)


@bp.route('/results', methods=['GET'])
def get_results():
    results_list = Result.query.all()
    results = []

    for res in results_list:
        results.append(res.to_dict())
    return jsonify(results)


@bp.route('/results/<int:id>')
def get_result(id):
    image = jsonify(Result.query.get_or_404(id).to_dict())
    return image


# Delete
@bp.route('/results/<int:id>/delete', methods=['GET', 'POST'])
def delete(id):

    item = Result.query.get(id)
    db.session.delete(item)
    db.session.commit()

    results_list = Result.query.all()
    results = []

    for res in results_list:
        results.append(res.to_dict())
    return jsonify(results)