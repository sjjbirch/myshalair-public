
desc "Deletes all attachments from everything in the DB."
task :attpurge => :environment do
    puts "Attempting to purge " + ActiveStorage::Attachment.all.count.to_s + " attachments."
    ActiveStorage::Attachment.all.each { |attachment| attachment.purge }
    puts "Remaining attachments: " + ActiveStorage::Attachment.all.count.to_s
end