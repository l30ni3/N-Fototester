from flask import jsonify, request, url_for, abort, flash, redirect
from app import db
from app.models import File
from app.views import bp
import urllib.request
import os
from os.path import join, dirname, realpath
from werkzeug.utils import secure_filename

ALLOWED_EXTENSIONS = set(['png', 'jpg', 'jpeg', 'gif'])
UPLOAD_FOLDER = join(dirname(realpath(__file__)), 'static/uploads/')


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
        file.save(os.path.join(UPLOAD_FOLDER, filename))
        print('upload_image filename: ' + filename)
        flash('Image successfully uploaded')
    else:
        flash('Allowed image types are - png, jpg, jpeg, gif')

    data = file.read()
    newFile = File(name=file.filename, data=data)
    db.session.add(newFile)
    db.session.commit()

    return ({}, 204)


@bp.route('/images', methods=['GET'])
def get_images():
    images_list = File.query.all()
    images = []

    for img in images_list:
        images.append({'id': img.id, 'name': img.name,
                      'pic_date': img.pic_date})
    return jsonify(images)


@bp.route('/images/<int:image_id>')
def get_image(image_id):
    image = jsonify(File.query.get_or_404(image_id).to_dict())
    print(image)
    return image


@bp.route('/update/<int:pic_id>', methods=['GET', 'POST'])
def update(pic_id):

    pic = File.query.get(pic_id)

    if request.method == 'POST':
        pic.location = request.form['location']
        pic.text = request.form['text']

        db.session.commit()
        flash(f'{pic.name} Has been updated')
        return redirect(url_for('index'))
    return render_template('update.html', pic=pic)


# Delete
@bp.route('/<int:pic_id>/delete', methods=['GET', 'POST'])
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
    return redirect(url_for('index'))
