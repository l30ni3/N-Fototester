from flask import jsonify, request, url_for, flash, redirect
from app import db
from app.models import Result
from app.views import bp
import os
from os.path import join, dirname, realpath
from werkzeug.utils import secure_filename
from io import BytesIO
from flask import send_file
from base64 import b64encode
import numpy as np
from plantcv import plantcv as pcv
import imghdr

ALLOWED_EXTENSIONS = set(['png', 'jpg', 'jpeg', 'gif'])
UPLOAD_FOLDER = join(dirname(realpath(__file__)), 'tmp/')


def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


@bp.route('/upload', methods=['POST'])
def upload():
    file = request.files['photo']
    if file.filename == '':
        flash('No image selected for uploading')
        return redirect(request.url)
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        pre, ext = os.path.splitext(filename)
        file.save(os.path.join(UPLOAD_FOLDER, 'current' + ext))
        print('upload_image filename: ' + filename)

        # Read image
        img, path, filename = pcv.readimage(
            os.path.join(UPLOAD_FOLDER, 'current' + ext))

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
            filename=os.path.join(UPLOAD_FOLDER, 'results.json'))
    else:
        flash('Allowed image types are - png, jpg, jpeg, gif')

    # tbd: send data to db
    data = file.read()
    newFile = Result(name=file.filename, data=data,
                     hue_circular_mean=hcm, hue_circular_std=hcs, hue_median=hm)
    db.session.add(newFile)
    db.session.commit()

    return jsonify(newFile.id)


@ bp.route('/results', methods=['GET'])
def get_images():
    results_list = Result.query.all()
    results = []

    for res in results_list:
        results.append(res.to_dict())
    return jsonify(results)


@ bp.route('/results/<int:id>')
def get_image(id):
    image = jsonify(Result.query.get_or_404(id).to_dict())
    return image


# Delete
@ bp.route('/results/<int:id>/delete', methods=['GET', 'POST'])
def delete(id):

    del_pic = Result.query.get(id)
    return ({}, 204)
