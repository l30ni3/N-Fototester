from flask import jsonify, request, url_for, abort, flash, redirect
from app import db
from app.models import File
from app.views import bp
import os
from os.path import join, dirname, realpath
from werkzeug.utils import secure_filename
from io import BytesIO
from flask import send_file
from base64 import b64encode
import numpy as np
from plantcv import plantcv as pcv

ALLOWED_EXTENSIONS = set(['png', 'jpg', 'jpeg', 'gif'])
UPLOAD_FOLDER = join(dirname(realpath(__file__)), 'tmp/')


def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


@bp.route('/images/upload', methods=['POST'])
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
            rgb_img=img, mask=mask2, hist_plot_type=None, label="default")

        # Access data stored out from analyze_color
        print(pcv.outputs.observations['default']
              ['hue_circular_mean']['value'])

        hue_circular_mean = pcv.outputs.observations['default']['hue_circular_mean']['value']

        # Access data stored out from analyze_color
        print(pcv.outputs.observations['default']['hue_circular_std']['value'])

        hue_circular_std = pcv.outputs.observations['default']['hue_circular_std']['value']

        # Access data stored out from analyze_color
        print(pcv.outputs.observations['default']['hue_median']['value'])

        hue_median = pcv.outputs.observations['default']['hue_median']['value']

        # Write shape data to results file
        pcv.outputs.save_results(
            filename=os.path.join(UPLOAD_FOLDER, 'results.json'))
    else:
        flash('Allowed image types are - png, jpg, jpeg, gif')

    # tbd: send data to db
    data = file.read()
    newFile = File(name=file.filename, data=data)
    db.session.add(newFile)
    db.session.commit()

    return ({}, 204)


@ bp.route('/images', methods=['GET'])
def get_images():
    images_list = File.query.all()
    images = []

    for img in images_list:
        images.append(img.to_dict())
    return jsonify(images)


@ bp.route('/images/<int:image_id>')
def get_image(image_id):
    image = jsonify(File.query.get_or_404(image_id).to_dict())
    return image


@ bp.route('/images/download/<int:image_id>')
def download(image_id):
    image = File.query.filter_by(id=image_id).first()
    return send_file(BytesIO(image.data), attachment_filename='image.jpg', as_attachment=True)


# Delete
@ bp.route('/<int:pic_id>/delete', methods=['GET', 'POST'])
def delete(pic_id):

    del_pic = File.query.get(pic_id)
    if request.method == 'POST':
        form = request.form['delete']
        if form == 'Delete':
            print(del_pic.name)
            db.session.delete(del_pic)
            db.session.commit()
            flash('Picture deleted from Database')
            return redirect(url_for('index'))
    return ({}, 204)
