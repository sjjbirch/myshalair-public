
desc "Deletes all attachments from everything in the DB."
task :attpurge => :environment do

    ActiveStorage::Attachment.all.each { |attachment| attachment.purge }

end