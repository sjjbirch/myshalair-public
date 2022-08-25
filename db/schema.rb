# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.0].define(version: 2022_08_25_055613) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "active_storage_attachments", force: :cascade do |t|
    t.string "name", null: false
    t.string "record_type", null: false
    t.bigint "record_id", null: false
    t.bigint "blob_id", null: false
    t.datetime "created_at", null: false
    t.index ["blob_id"], name: "index_active_storage_attachments_on_blob_id"
    t.index ["record_type", "record_id", "name", "blob_id"], name: "index_active_storage_attachments_uniqueness", unique: true
  end

  create_table "active_storage_blobs", force: :cascade do |t|
    t.string "key", null: false
    t.string "filename", null: false
    t.string "content_type"
    t.text "metadata"
    t.string "service_name", null: false
    t.bigint "byte_size", null: false
    t.string "checksum"
    t.datetime "created_at", null: false
    t.index ["key"], name: "index_active_storage_blobs_on_key", unique: true
  end

  create_table "active_storage_variant_records", force: :cascade do |t|
    t.bigint "blob_id", null: false
    t.string "variation_digest", null: false
    t.index ["blob_id", "variation_digest"], name: "index_active_storage_variant_records_uniqueness", unique: true
  end

  create_table "allowlisted_jwts", force: :cascade do |t|
    t.string "jti", null: false
    t.string "aud"
    t.datetime "exp", null: false
    t.bigint "user_id", null: false
    t.index ["jti"], name: "index_allowlisted_jwts_on_jti", unique: true
    t.index ["user_id"], name: "index_allowlisted_jwts_on_user_id"
  end

  create_table "children", force: :cascade do |t|
    t.bigint "litter_application_id", null: false
    t.integer "age"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["litter_application_id"], name: "index_children_on_litter_application_id"
  end

  create_table "contacts", force: :cascade do |t|
    t.string "email"
    t.string "phonenumber"
    t.integer "reason"
    t.string "text"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "dogs", force: :cascade do |t|
    t.string "callname"
    t.string "realname"
    t.date "dob"
    t.integer "sex"
    t.string "ownername"
    t.string "breedername"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.boolean "retired", default: false
    t.integer "position", null: false
    t.integer "owner_id", default: 1
    t.text "description", default: "This dog doesn't yet have a description."
    t.integer "colour", default: 0
    t.string "chipnumber"
    t.boolean "display", default: true
    t.index ["position"], name: "index_dogs_on_position"
  end

  create_table "healthtests", force: :cascade do |t|
    t.integer "pra"
    t.integer "fn"
    t.integer "aon"
    t.integer "ams"
    t.integer "bss"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "dog_id"
    t.index ["dog_id"], name: "index_healthtests_on_dog_id"
  end

  create_table "litter_applications", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.bigint "litter_id", null: false
    t.float "yardarea"
    t.float "yardfenceheight"
    t.integer "priority", default: 999
    t.integer "fulfillstate"
    t.integer "paystate"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "colour_preference"
    t.integer "sex_preference"
    t.index ["litter_id"], name: "index_litter_applications_on_litter_id"
    t.index ["user_id"], name: "index_litter_applications_on_user_id"
  end

  create_table "litters", force: :cascade do |t|
    t.bigint "breeder_id", null: false
    t.integer "esize"
    t.date "pdate"
    t.date "edate"
    t.date "adate"
    t.text "lname"
    t.bigint "sire_id", null: false
    t.bigint "bitch_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "status", null: false
    t.index ["bitch_id"], name: "index_litters_on_bitch_id"
    t.index ["breeder_id"], name: "index_litters_on_breeder_id"
    t.index ["sire_id"], name: "index_litters_on_sire_id"
    t.index ["status"], name: "index_litters_on_status"
  end

  create_table "pets", force: :cascade do |t|
    t.bigint "litter_application_id", null: false
    t.integer "age"
    t.text "pettype"
    t.text "petbreed"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.boolean "desexed", default: false
    t.index ["litter_application_id"], name: "index_pets_on_litter_application_id"
  end

  create_table "puppy_lists", force: :cascade do |t|
    t.bigint "dog_id"
    t.bigint "litter_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "litter_application_id"
    t.index ["dog_id"], name: "index_puppy_lists_on_dog_id"
    t.index ["litter_application_id"], name: "index_puppy_lists_on_litter_application_id"
    t.index ["litter_id"], name: "index_puppy_lists_on_litter_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "username"
    t.string "email"
    t.boolean "breeder"
    t.string "firstname"
    t.string "lastname"
    t.string "address1"
    t.string "address2"
    t.string "suburb"
    t.integer "postcode"
    t.string "phonenumber"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.boolean "admin", default: false
    t.string "encrypted_password", default: "", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer "sign_in_count", default: 0, null: false
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.string "current_sign_in_ip"
    t.string "last_sign_in_ip"
    t.string "confirmation_token"
    t.datetime "confirmed_at"
    t.datetime "confirmation_sent_at"
    t.string "unconfirmed_email"
    t.index ["confirmation_token"], name: "index_users_on_confirmation_token", unique: true
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
  end

  add_foreign_key "active_storage_attachments", "active_storage_blobs", column: "blob_id"
  add_foreign_key "active_storage_variant_records", "active_storage_blobs", column: "blob_id"
  add_foreign_key "allowlisted_jwts", "users", on_delete: :cascade
  add_foreign_key "children", "litter_applications"
  add_foreign_key "dogs", "users", column: "owner_id"
  add_foreign_key "healthtests", "dogs"
  add_foreign_key "litter_applications", "litters"
  add_foreign_key "litter_applications", "users"
  add_foreign_key "litters", "dogs", column: "bitch_id"
  add_foreign_key "litters", "dogs", column: "sire_id"
  add_foreign_key "litters", "users", column: "breeder_id"
  add_foreign_key "pets", "litter_applications"
  add_foreign_key "puppy_lists", "dogs"
  add_foreign_key "puppy_lists", "litter_applications"
  add_foreign_key "puppy_lists", "litters"
end
