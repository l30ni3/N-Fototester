from flask import jsonify, request, flash, redirect, send_from_directory, session
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

# TODO: import app.config for constants
basedir = os.path.abspath(os.path.dirname(__file__))
ALLOWED_EXTENSIONS = set(['png', 'jpg', 'jpeg', 'gif'])
AVATARS_SAVE_PATH = os.path.join(basedir, 'avatars')
# UPLOAD_FOLDER = os.path.join(basedir, 'tmp')
TMP_FOLDER = join(dirname(realpath(__file__)), 'tmp/')
AVATAR_FOLDER = os.path.join(basedir, 'avatars')


def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


@bp.route('/upload', methods=['POST'])
# def upload():
#     file = request.files['photo']
#     # TODO compress image before safe as avatar
#     avatar_filename = avatars.save_avatar(file)
#     if file.filename == '':
#         print('No image selected for uploading')
#         return redirect(request.url)
#     if file and allowed_file(file.filename):
#         filename = secure_filename(file.filename)
#         pre, ext = os.path.splitext(filename)
#         file.save(os.path.join(UPLOAD_FOLDER, 'current' + ext))
#         print('upload_image filename: ' + filename)
#         # Read image
#         img, path, filename = pcv.readimage(
#             os.path.join(UPLOAD_FOLDER, 'current' + ext))
#         mask, masked_img = pcv.threshold.custom_range(
#             img=img, lower_thresh=[25, 0, 0], upper_thresh=[75, 255, 255], channel='HSV')
#         binary_img = pcv.median_blur(gray_img=mask, ksize=10)
#         mask2 = pcv.fill(bin_img=binary_img, size=200)
#         # Identify objects
#         id_objects, obj_hierarchy = pcv.find_objects(img, mask2)
#         # Get size of image
#         h, w, c = img.shape
#         # Define ROI
#         roi1, roi_hierarchy = pcv.roi.rectangle(
#             img=img, x=0, y=h/8*3, h=h/4, w=w)
#         # Decide which objects to keep
#         roi_objects, hierarchy3, kept_mask, obj_area = pcv.roi_objects(img=img, roi_contour=roi1,
#                                                                        roi_hierarchy=roi_hierarchy,
#                                                                        object_contour=id_objects,
#                                                                        obj_hierarchy=obj_hierarchy,
#                                                                        roi_type='partial')
#         # Object combine kept objects
#         obj, mask2 = pcv.object_composition(
#             img=img, contours=roi_objects, hierarchy=hierarchy3)
#         # Determine color properties: Histograms, Color Slices, output color analyzed histogram (optional)
#         color_histogram = pcv.analyze_color(
#             rgb_img=img, mask=mask2, colorspaces="all", label="default")
#         # color_histogram.save(os.path.join(UPLOAD_FOLDER, 'histogram'))
#         # Access data stored out from analyze_color
#         print(pcv.outputs.observations['default']
#               ['hue_circular_mean']['value'])
#         hcm = pcv.outputs.observations['default']['hue_circular_mean']['value']
#         # Access data stored out from analyze_color
#         print(pcv.outputs.observations['default']['hue_circular_std']['value'])
#         hcs = pcv.outputs.observations['default']['hue_circular_std']['value']
#         # Access data stored out from analyze_color
#         print(pcv.outputs.observations['default']['hue_median']['value'])
#         hm = pcv.outputs.observations['default']['hue_median']['value']
#         # Write shape data to results file
#         pcv.outputs.save_results(
#             filename=os.path.join(UPLOAD_FOLDER, 'results.json'))
#     else:
#         flash('Allowed image types are - png, jpg, jpeg, gif')
#     json_file = open(os.path.join(UPLOAD_FOLDER, 'results.json'))
#     json_data = json.loads(json_file.read())
#     # to do: add json_data to data column in db
#     # print(json_data)
#     data = file.read()
#     image_string = base64.b64encode(data).decode('ascii')
#     print("image_string: ", image_string)
#     # newFile = Result(name=file.filename, data=data, base64=image_string,
#     #                  hue_circular_mean=hcm, hue_circular_std=hcs, hue_median=hm)
#     newFile = Result(name=file.filename, avatar=avatar_filename,
#                      hue_circular_mean=hcm, hue_circular_std=hcs, hue_median=hm)
#     db.session.add(newFile)
#     db.session.commit()
#     return jsonify(newFile.id)
def upload():
    file = request.files['photo']
    # with open(file.filename, "rb") as image_file:
    #     encoded_string = base64.b64encode(image_file.read())
    #     print(encoded_string.decode('utf-8'))
    if file.filename == '':
        print('No image selected for uploading')
        return redirect(request.url)
    if file.filename == '':
        flash('No image selected for uploading')
        return redirect(request.url)
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        pre, ext = os.path.splitext(filename)
        file.save(os.path.join(TMP_FOLDER, "current" + ext))
        file.save(os.path.join(AVATAR_FOLDER, file.filename))

        print('upload_image filename: ' + filename)

        # Read image
        img, path, filename = pcv.readimage(
            os.path.join(TMP_FOLDER, 'current' + ext))

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

        # Write shape data to results file
        pcv.outputs.save_results(
            filename=os.path.join(TMP_FOLDER, 'results.json'))
    else:
        flash('Allowed image types are - png, jpg, jpeg, gif')

    # tbd: send data to db
    # data = file.read()
    # newFile = Result(name=file.filename, data=data, hue_circular_mean=hcm, hue_circular_std=hcs, hue_median=hm)
    newFile = Result(name=file.filename,
                     hue_circular_mean=hcm, hue_circular_std=hcs, hue_median=hm)
    db.session.add(newFile)
    db.session.commit()

    return jsonify(newFile.id)

# TODO: serve avatar image


@ bp.route('/avatars/<path:filename>')
def get_avatar(filename):
    return send_from_directory(bp.config['AVATARS_SAVE_PATH'], filename)


@ bp.route('/results', methods=['GET'])
def get_results():
    results_list = Result.query.all()
    results = []

    for res in results_list:
        results.append(res.to_dict())
    return jsonify(results)


@ bp.route('/results/<int:id>')
def get_result(id):
    image = jsonify(Result.query.get_or_404(id).to_dict())
    return image


# Delete
@ bp.route('/results/<int:id>/delete', methods=['GET', 'POST'])
def delete(id):

    item = Result.query.get(id)
    db.session.delete(item)
    db.session.commit()

    results_list = Result.query.all()
    results = []

    for res in results_list:
        results.append(res.to_dict())
    return jsonify(results)
